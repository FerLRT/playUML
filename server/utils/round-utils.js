export const customRound = (num) => {
  const floor = Math.floor(num);
  const decimal = num - floor;

  if (decimal === 0 || decimal === 0.5) {
    // Si el decimal es 0 o 0.5, no es necesario redondear
    return num;
  } else if (decimal < 0.5) {
    // Si el decimal es menor que 0.5, redondea hacia abajo
    return floor;
  } else {
    // Si el decimal es mayor que 0.5, redondea hacia arriba
    return floor + 0.5;
  }
};
