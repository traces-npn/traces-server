# traces-server
Aplicació servidora del projecte Traces

*Traces. Seguiment de curses d’esquí de muntanya en línia.**

Màster Universitari en Enginyeria Informàtica
TFM - Àrea  de Serveis basats en localització i espais intel·ligents
Universitat Oberta de Catalunya

**Autor:** Jaume Casanovas Coma

**Directora del TFM**: Anna Muñoz Bollas

**Professor responsable de l’assignatura**: Antoni Pérez Navarro


Gener de 2022

**Condicions prèvies:**
Abans d'executar el projecte Traces Server i Traces Web, cal intal·lar la base de dades i executar el projecte Traces API

**Instal·lar les llibreries utilitzades:**
Des de la carpeta arrel de l’aplicació, executar:

npm install

**Execució de l'aplicació Traces Server**

node src/index.js
npm start

En mode desenvolupador:

Aquesta opció permet executar l’aplicació per realitzar canvis en calent, sense haver de tornar a iniciar l’aplicació a cada modificació.

node src/index.js
npm install nodemon -D
npm run dev


**Execució de l'aplicació Traces Web:**
http://localhost:3000/


Matar processos oberts
lsof -i tcp:3000
kill -9 <PID>
