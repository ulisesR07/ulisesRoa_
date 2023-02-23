const fs = require('fs/promises')

class Contenedor{

    constructor(NombreArchivo){
        this.fileName = NombreArchivo;
        this.filePath = `./${this.fileName}`;
        this.data = (async ()=>{
            try {
                const readenFile= await fs.readFile(this.filePath, 'utf-8');
                return JSON.parse(readenFile)
            } catch (err){
                console.error(err.message)
                return []
            }
        })();
    }
    async write(datos){
        try {
            await fs.writeFile(this.filePath, JSON.stringify(datos, null, 3))
        } catch (error) {
            
        }
    }
    
    async save(objeto){
        const ContenidoArchivo = await this.data
        let nuevoId = ContenidoArchivo.length+1
        let nuevoObj = {id: nuevoId, ...objeto}
        ContenidoArchivo.push(nuevoObj)
        await this.write(ContenidoArchivo)
        console.log(nuevoObj.id)
    }

    async getById(id){
        try {
            const ContenidoArchivo = await this.data
            const theItem = ContenidoArchivo.find(item => item.id === id);
            return(theItem)
        } catch (error) {
            console.log("Hubo un error al traer el objeto" + error)
        }
    }
    async getAll(){
        const ContenidoArchivo = await this.data
        return(ContenidoArchivo)
    }
    async deleteById(id){
        const ContenidoArchivo = await this.data
        let noBorrare = ContenidoArchivo.filter(item => item.id !== id)
        await this.write(noBorrare)
    }
    async deleteAll(){
        let nuevoContent = []
        await this.write(nuevoContent)
    }
}

module.exports={
    Contenedor
}