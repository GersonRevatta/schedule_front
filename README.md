#
## Resumen
Aplicación, para agendar horarios de monitoreo por usuario, 
a partir de contratos semanales.  
- Contratos semanales: Van a estar determinados por horas determinadas por el cliente(Empresa a la que se le va a brindar el servicio)  
- Usuario: Va a poder hacer un inicio de session y agendar su horario de monitoreo, por semana y por cliente(Empresa)

###### Imagen
![image](https://active-web-bravo-izquierdo.s3.us-east-2.amazonaws.com/WhatsApp+Image+2022-08-03+at+3.25.23+AM.jpeg)

##### Componentes: 
- Navbar: Links  
- Index: Pagina principal, para determinar la semana y el cliente, por el cual se renderizara el calendario  
- Calendar: Desplegara un calendario  
- Login: Inicio de sesión 

### Ejecutar Proyecto 
node versions
```
v16.16.0
```

Instalar
```
npm install
```

Editar archivo .env
```
VITE_URL_PATH="http://localhost:3000/api/v1/"
```

Ejecutar , y click [Link](http://localhost:8080/)
```
npm run dev -- --host --port=8080
```
