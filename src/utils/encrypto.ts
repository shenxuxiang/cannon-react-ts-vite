import JSSHA from 'jssha';

export default function encrypto(value: string) {
  const hash = new JSSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  hash.update(value);
  return hash.getHash('HEX');
}
