export const arrayBufferToUrl = (arrayBufferString, imageType) => {
  // Eliminar el prefijo '\\x' de la cadena hexadecimal
  const hexWithoutPrefix = arrayBufferString.substring(2);
  // Convertir la cadena hexadecimal a un array de bytes
  const bytes = hexWithoutPrefix
    .match(/.{1,2}/g)
    .map((byte) => parseInt(byte, 16));
  // Crear un ArrayBuffer a partir de los bytes
  const arrayBuffer = new Uint8Array(bytes).buffer;
  // Crear una URL de objeto a partir del ArrayBuffer
  const url = URL.createObjectURL(
    new Blob([arrayBuffer], { type: `image/${imageType}` })
  );
  return url;
};
