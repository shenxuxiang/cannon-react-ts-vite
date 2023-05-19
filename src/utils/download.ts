export default function downloadFile(fileName: string, data: any) {
  const blob = new Blob([data]);
  const eLink = document.createElement('a');
  eLink.download = /\.xlsx$/i.test(fileName) ? fileName : fileName + '.xlsx';
  eLink.style.display = 'none';
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  // 释放 URL 对象
  URL.revokeObjectURL(eLink.href);
  document.body.removeChild(eLink);
}
