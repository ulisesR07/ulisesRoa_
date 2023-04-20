const socket = io()
console.log('SOY UN CLIENTE')

const submitProduct = document.getElementById('submitProduct')
const productsTable = document.getElementById('productsTableBody')

const submitMessage = document.getElementById('submitMessage')
const messageTable = document.getElementById('messageTableBody')


//submitProduct es un boton que se encuentra en /ejs/ejsPartials/embededForm.ejs
//es el boton que permite ingresar un producto nuevo.
submitProduct.addEventListener('click', (event) => {
    event.preventDefault()
    const newProduct = {
        //toma los valores ingresados en las cajas de textos de productos.
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    if ((newProduct.title == '') || (newProduct.price == '') || (newProduct.thumbnail == '')) {
        console.log('faltan datos')
    } else {
        document.getElementById('title').value = ''
        document.getElementById('price').value = ''
        document.getElementById('thumbnail').value = ''

        //envia los valores ingresados, los cuales seran recibidos por server.js
        socket.emit('addProduct', newProduct)
    }
})


/*una vez que los productos son guardados en la base de datos por server.js, son recibidos aqui para ser dibujados en el DOM como lista de productos*/
socket.on('refreshList', data3 => {
    const newItem =
        `<tr>
            <td>
                ${data3.title}
            </td>
            <td>
                ${data3.price}
            </td>
            <td><img src=${data3.thumbnail} alt="product image" width="50" height="50"></td>
        </tr>`
    console.log(socket)
    productsTable.innerHTML += newItem
})

/******************************************************************************************** */

/*submitMessage es un boton que se encuentra en embededChat.ejs es utilizado para enviar el mensaje al chat.*/
submitMessage.addEventListener('click', (event) => {
    event.preventDefault()


    const newMessage = {
        author: {
            //recibo los valores de las cajas de texto
            id: document.getElementById('emailInput').value,
            nombre: document.getElementById('nameInput').value,
            apellido: document.getElementById('surnameInput').value,
            edad: document.getElementById('ageInput').value,
            alias: document.getElementById('aliasInput').value,
            avatar: "../static/icons/generic_avatar.png"
        },
        text: document.getElementById('messageInput').value
    }



    if ((newMessage.mail == '') || (newMessage.message == '')) {
        console.log('faltan datos')
    } else {
        document.getElementById('messageInput').value = ''

        /*envia por socket los datos ingresados en el chat, y los recibira server.js para guardarlos en la base*/
        socket.emit('addMessage', newMessage)
    }
})


/*una vez que server.js guarda los mensajes en la base de datos, los vuelve a enviar y son recibidos aqui, para dibujarlas en el DOM*/
socket.on('refreshMessages', messageCont => {

    const newItem =
        `<tr>
            <th scope="row" style="color:blue">
                <img src=${messageCont.author.avatar} alt="avatar" width="50" height="50"></td>
            </th>
            <td>
                ${messageCont.author.nombre} ${messageCont.author.apellido}
            </td>
            <td>
                ${messageCont.text}
            </td>
        </tr>`
    messageTable.innerHTML += newItem
})