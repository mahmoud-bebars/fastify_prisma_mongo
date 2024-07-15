// this is the main function to Genrate the Unique OTPs
module.exports.generate = () => {
  const array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let codeString = "";

  for (i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    codeString = codeString + array[randomIndex];
  }
  return codeString;
};
