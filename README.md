# Explorador de Países 🌍 - Reto Frontend

Una aplicación web interactiva que consume la API de REST Countries (https://restcountries.com) para explorar información sobre países del mundo.

## Características

- **Lista de países** con:
  - Paginación en el cliente 📄.
  - Barra de búsqueda por nombre 🔍.
  - Filtros por región, subregión y lenguaje 🌎.
  
- **Vista de detalles de cada país**:
  - Bandera 🇪🇸, capital 🏙️, población 👥, área 🌐, monedas 💰 y lenguajes 🗣️.
  - Países vecinos con enlaces a sus respectivas páginas 🌍.
  - Mapa de ubicación (para algunos países) 🗺️.
  
- Soporte para **modo oscuro/claro** 🌙☀️.

## Tecnologías Usadas 🛠️

- React ⚛️
- TypeScript 🔠
- Material-UI 🎨
- Docker 🐳
- GitHub 🧑‍💻

## Instalación y Uso 🚀

### Uso de GitHub

#### Clonar el Repositorio
```
git clone git@github.com:emmanuel-meltsan/exploramundo.git
cd exploramundo
```
#### Instalación de Dependencias
```
npm install
```
#### Ejecutar en Desarrollo
```
npm run dev
```
La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## Despliegue con Docker 🚢

#### Construcción de la Imagen
```
docker build -t exploramundo:latest .
```
#### Ejecutar el Contenedor
```
docker compose -p exploramundo up
```
La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

#### Publicación en Docker Hub
puedes encontrar la aplicacion en [Docker Hub](https://hub.docker.com/repository/docker/emmlg/exploramundo/general)



## Creado por 📝

Este proyecto fue creado por [Emmanuel Lopez](https://github.com/emmanuel-meltsan/exploramundo)
