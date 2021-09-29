export const formatNum = (number) =>  {
    number = number.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(number))
    number = number.replace(pattern, "$1,$2");
    return number;
};