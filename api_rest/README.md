
## Aplicación web de Ecommerce de productos con logger y swagger implementado.

### Para iniciar la aplicación

Descargar los paquetes de package.json y, sobre la carpeta del repositorio, ejecutar npm start.

Antes de ejecutar el comando, es necesario crear un archivo .env en el que deben detallarse: 
 - PORT (Por defecto 8080)
 - CONNECTION
 - BCRYPTGENSALT
 - JWTKEY
 - PERSISTENCE
 - MAILPASSWORD
 - LOGGER

### Informacion del proyecto

El proyecto cuenta con varias APIs, las cuales son 
 - session
 - carts
 - products
 - tickets
 - messages

Para acceder a cada una de ellas, la URL es /api/nombreApi/metodo

### Persistencias

El proyecto puede trabajar tanto con Mongo como con persistencia en archivos, esto se define en el PERSISTENCE del .env y utiliza el patrón Factory para alternar entre estos

### User Experience

La aplicación cuenta con varias secciones, incluyendo un chat para usuarios, un sistema de roles para la creación y modificación de archivos, usuarios con carritos autogenerados para cada usuario, sistema de compras con control y verificación de stock y motor de plantillas con handlebars. Los productos pueden ser agregados tanto por administradores como por usuarios premium; estos últimos pueden modificar y eliminar sus productos, pero no pueden añadirlos a sus carritos

### Usuario administrador

El usuario administrador tiene como email UlisesUser@gmail.com y como contraseña UlisesContrasenia

### Rutas de utilidad

La ruta /api/products/mockProducts arroja 100 productos como si fuese una petición a MongoDB, no tiene ninguna modificacion

La ruta /loggerTest arroja un logger de cada tipo

La ruta /apidocs brinda información adicional sobre las rutas de las APIs carts y products

### Detalles
Para que el servidor esté en producción y no muestre los loggers, el LOGGER del archivo .env debe ser "PRODUCTION"
