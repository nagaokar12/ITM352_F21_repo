/* Declare variables */
age = 21;
name = 'Reece';

var attributes = name + ";" + age + ";" + (age + 0.5) + (0.5-age);

var parts = attributes.split(';');

for(part of parts) {
    console.log(parts);
}

