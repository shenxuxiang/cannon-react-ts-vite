import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';

type Html2CanvasOptions = {
  scale: number;
  useCORS: boolean;
  allowTaint: boolean;
  x: number;
  y: number;
  scrollX: number;
  scrollY: number;
};

type PdfOptions = {
  orientation: 'p' | 'l';
  format: 'a4';
  safeAreaOffset: [number, number];
  showPageNumber: boolean;
};

const defaultHtml2CanvasOptions = {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  x: 0,
  y: 0,
  scrollX: 0,
  scrollY: 0,
};

const defaultPdfOptions: Required<PdfOptions> = {
  orientation: 'p',
  format: 'a4',
  safeAreaOffset: [50, 20],
  showPageNumber: true,
};

// protrait:  Array[0]-宽度，Array[1]-高度。
// landscape: Array[1]-宽度，Array[0]-高度。
const width$height = {
  a4: [595.28, 841.89],
};

type PrintClassProps = {
  element: HTMLElement;
  html2CanvasOptions?: Partial<Html2CanvasOptions>;
  pdfOptions?: Partial<PdfOptions>;
  fileName?: string;
};

class PrintPDF {
  public h2cOpts: Html2CanvasOptions;
  public pdfOpts: PdfOptions;
  public element: HTMLElement;
  public pdf$safeAreaWidth: number;
  public pdf$safeAreaHeight: number;
  public pdf$width: number;
  public pdf$height: number;
  public pdf: any;
  public fileName: string;
  public ignoreTagNames = new Set<String>(['colgroup', 'td', 'link', 'script', 'svg']);
  public ignoreNodes = new WeakSet<HTMLElement>();

  constructor(props: PrintClassProps) {
    const { element, html2CanvasOptions, pdfOptions, fileName = 'default' } = props;
    this.element = element;
    this.h2cOpts = { ...defaultHtml2CanvasOptions, ...html2CanvasOptions };
    this.pdfOpts = { ...defaultPdfOptions, ...pdfOptions };
    this.fileName = fileName.endsWith('.pfd') ? fileName : fileName + '.pdf';
    // safeAreaOffset 表示 xy 方向的距离安全区域的便宜量。
    const { orientation, format, safeAreaOffset } = this.pdfOpts;
    const [pdf$width, pdf$height] = width$height[format];
    /**
     * 创建一个 pdf 实例对象
     * @params { orientation } 打印的方向（A4 纸横向打印还是纵向）。p => protrait; l => landscape。
     * @params { formate }     PDF 的格式（尺寸），默认 "a4"。你也可以通过定义尺寸，例如 [ 595.28, 841.89 ]。
     * @params { unit }        单位。用于打印时统一使用 "pt" 作为单位。
     */
    this.pdf = new JSPDF({ orientation, format, unit: 'pt' });

    if (orientation === 'p') {
      this.pdf$width = pdf$width;
      this.pdf$height = pdf$height;
    } else {
      this.pdf$width = pdf$height;
      this.pdf$height = pdf$width;
    }
    this.pdf$safeAreaWidth = this.pdf$width - safeAreaOffset[1] * 2;
    this.pdf$safeAreaHeight = this.pdf$height - safeAreaOffset[0] * 2;
  }

  addIgnoreNodes(node: HTMLElement) {
    this.ignoreNodes.add(node);
  }

  addIgnoreTagNames(tagName: string) {
    this.ignoreTagNames.add(tagName);
  }

  async print() {
    let canvas = null;
    try {
      canvas = await html2canvas(this.element, this.h2cOpts);
    } catch (error) {
      return Promise.reject(error);
    }

    document.body.appendChild(canvas);

    const { scale } = this.h2cOpts;
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const { width: canvas$width, height: canvas$height } = canvas;
    // 一页 PDF 的高度转换成 HTML 的高度。
    const pdfHeight2htmlHeight = ((canvas$width / this.pdf$safeAreaWidth) * this.pdf$safeAreaHeight) / scale;
    // html 转换成 pdf 的宽度
    const pdfContentWidth = this.pdf$safeAreaWidth;
    // html 转成成 pdf 的高度（这里是所有要打印内容的高度）
    const pdfContentHeight = (canvas$height * this.pdf$safeAreaWidth) / canvas$width;

    // 遍历要打印的 HTML 内容的根节点，计算出每个 PDF 页面内容底部的偏移量（相对 this.element.offsetTop）
    const pos = this.traversNode(this.element, pdfHeight2htmlHeight);
    // 将计算出的 pos 转换成 pdf 中的位置。
    const positions = pos.map((item) => (-item * scale * pdfContentHeight) / canvas$height);
    const safeAreaOffsetLeft = this.pdfOpts.safeAreaOffset[1];
    const safeAreaOffsetTop = this.pdfOpts.safeAreaOffset[0];
    let count = 0;
    do {
      /**
       * 在每个 PDF 页面中中间位置绘制 PDF 内容部分。
       * addImage(data, format, x, y, w, h);
       * x、y 表示内容相对于左上角原点的偏移量（你可以将原点理解为PDF左上角的那个点）。xy 方向都加了安全偏移量
       *  w、h 表示内容的宽度和高度
       */
      this.pdf.addImage(
        imgData,
        'JPEG',
        safeAreaOffsetLeft,
        safeAreaOffsetTop + positions[count++],
        pdfContentWidth,
        pdfContentHeight,
      );
      // 设置填充的颜色
      this.pdf.setFillColor('#ffffff');
      // 在每个 PDF 页面的页头绘制并填充一个矩形
      this.pdf.rect(0, 0, this.pdf$width, safeAreaOffsetTop, 'F');

      /**
       * 打个比方：PDF 的高度是 1000，安全区域的高度是 800（四周要预留空白）。
       * 此时，页面只绘制了500，剩余的300是因为后面的元素是跨页了，所以要留到下一个页面绘制。
       * 所以此时这剩余的 300 是不能展示任何内容的，所以通过 rect() 将这部分进行遮罩。
       * 注意，最后一页时不需要遮罩的，因为内容绘制到这里就全部绘制完了，所以无需遮罩。
       */
      if (count < positions.length) {
        const contentHeight = positions[count - 1] - positions[count];
        this.pdf.rect(
          0,
          safeAreaOffsetTop + contentHeight,
          this.pdf$width,
          // 页面底部的这个遮罩，从绘制的开始位置开始一直到页面最底部，
          // 只需要保证这个高度足够大就行，不需要精确到某个数值（你也可以填99999）。它不会绘制到下一页。
          this.pdf$height - contentHeight,
          'F',
        );
      }

      // 是否显示页数
      if (this.pdfOpts.showPageNumber) {
        // 设置字体颜色
        this.pdf.setTextColor('#b3b3b3');
        // 设置字体大小
        this.pdf.setFontSize(12);
        // 要打印的内容（不要使用中文，中文会乱码）
        this.pdf.text(
          `———————— ${count}/${positions.length} ————————`,
          this.pdf$width / 2,
          this.pdf$safeAreaHeight + safeAreaOffsetTop * 1.5,
          {
            align: 'center',
            baseline: 'middle',
          },
        );
      }

      this.pdf.addPage();
    } while (count < positions.length);

    this.pdf.deletePage(count + 1);
    this.pdf.save(this.fileName);
    return Promise.resolve();
  }

  // 验证节点是否是有效的节点
  validateNode(node: HTMLElement) {
    if (this.ignoreTagNames.has(node.nodeName.toLowerCase())) return false;
    if (this.ignoreNodes.has(node)) return false;
    const style = window.getComputedStyle(node);
    const display = style.getPropertyValue('display');
    const opacity = style.getPropertyValue('opacity');
    if (display === 'none' || opacity === '0') return false;
    return true;
  }

  indivisibleNode(node: HTMLElement) {
    let { nodeType, nodeName, childElementCount } = node;

    return (
      nodeType === 3 ||
      childElementCount <= 0 ||
      nodeName.toLowerCase() === 'tr' ||
      nodeName.toLowerCase() === 'th' ||
      node.getAttribute('data-minimum-unit-pdf')
    );
  }

  /**
   * 对指定节点下的所有子节点进行遍历，并返回一个数组，数组用来记录
   * 计算每个 PDF 页面的内容最底部的那个节点距离最外层节点的 offsetTop。这个点将被记录到 pos 数组中。用于 PDF 分页打印
   * 遍历节点的目的是为了避免生成 PDF 时从元素的中间位置截断。
   */
  traversNode(node: any, pdf$height: number) {
    // eslint-disable-next-line
    const _this = this;
    const pos = [0];
    // 最外层节点，最初的那个节点。
    const node$outermost = node;
    // 原点坐标。
    const origin = { x: 0, y: 0 };
    // 第一次计算时，使用最外层的那个节点相对文档的垂直方向的偏移量。
    // 每当 pos 更新世，将使用当前节点的下一个兄弟节点的文档坐标来更新 origin。
    origin.y = getElementOffsetTop(node$outermost);

    function completeUnitOfWork(unitOfWork: any) {
      // 验证该节点是否应该被忽略。被忽略的元素以及该元素下的所有子节点都将会被忽略
      let node = unitOfWork;
      while (!_this.validateNode(node)) {
        while (!node.nextElementSibling) {
          node = node.parentNode;
          if (node === node$outermost) return;
        }
        node = node.nextElementSibling;
      }

      let offsetTop = getElementOffsetTop(node);
      let height = node.offsetHeight;
      // 计算出当前节点与 origin 的偏移量
      let dist = offsetTop - origin.y;

      if (dist > pdf$height) {
        // 表示这个节点已经不在当前 PDF 页面了。
        // 通过 completeWork() 得出此 PDF 页面的结束位置（也是下一页的开始位置）
        completeWork(node);
      } else if (dist + height >= pdf$height) {
        // 表示当前页面是一个跨 PDF 的页面。
        if (!_this.indivisibleNode(node)) {
          // 如果该节点有子节点，我们需要对该节点下的子节点进行查看
          completeUnitOfWork(node.firstElementChild);
        } else {
          completeWork(node);
        }
      } else {
        // 当前这个节点完全属于这个 PDF 页面，不存在跨页。
        // 此时就不需要对它的子节点进行计算了。
        while (!node.nextElementSibling) {
          node = node.parentNode;
          if (node === node$outermost) return;
        }
        completeUnitOfWork(node.nextElementSibling);
      }
    }

    function completeWork(node: any) {
      let offsetTop;
      let height;
      let dist;

      /**
       * 查找该节点的上一个相邻的兄弟节点，
       * 如果该节点是父节点下的第一个子节点，则查找父节点的上一个相邻的兄弟节点，
       * 同时，需要判断该节点是否跨页，只有不夸页的节点才满足条件。
       * 存在这样一种布局情况，水平方向布局时，我们需要验证这个 position 上是否存在其他的节点。
       */
      do {
        while (!node.previousElementSibling) {
          node = node.parentNode;
          if (node === node$outermost) return;
        }
        // 查找节点相邻的上一个兄弟节点
        node = node.previousElementSibling;
        offsetTop = getElementOffsetTop(node);
        height = node.offsetHeight;
        dist = offsetTop - origin.y;

        while (dist + height > pdf$height && !_this.indivisibleNode(node)) {
          node = node.lastElementChild;
          offsetTop = getElementOffsetTop(node);
          height = node.offsetHeight;
          dist = offsetTop - origin.y;
        }

        // 如果条件满足，证明该节点跨页，所以继续循环遍历。
        // 判断这个位置是否是一个有效的节点
      } while (dist + height > pdf$height || !_this.validateNode(node));

      pos.push(pos[pos.length - 1] + dist + height + 1);
      origin.y = offsetTop + height;

      while (!node.nextElementSibling) {
        node = node.parentNode;
        if (node === node$outermost) return;
      }
      completeUnitOfWork(node.nextElementSibling);
    }

    completeUnitOfWork(node.firstElementChild);
    return pos;
  }
}

function getElementOffsetTop(element: HTMLElement) {
  let offsetTop = element.offsetTop;
  let parent: any = element.offsetParent;
  while (parent) {
    offsetTop += parent.offsetTop;
    offsetTop += parseInt(getComputedStyle(parent).getPropertyValue('border-top-width')) | 0;
    parent = parent.offsetParent;
  }
  return offsetTop;
}

export default PrintPDF;
