month = 8;
day = 28;
year = 2000;

step1 = 0;
step2 = parseInt(step1/4);
step3 = step1 + step2;
step4 = 2;
step6 = step4 + step3;
step7 = day + step6;
step8 = step7 - 1;
final = parseInt(step8 % 7);

console.log(final);

