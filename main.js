const api = axios.create({   // creamos instancias de axios, para que no tengamos que repetir codigo
    baseURL: 'https://api.thecatapi.com/v1'
}) 

api.defaults.headers.common['X-API-KEY'] = 'f4579016-a4ad-422a-bb90-499f4bddc8e3' // ya tenemos la instancia 

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=f4579016-a4ad-422a-bb90-499f4bddc8e3'; // parametrizamos la URL del API 
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites'; // la documentacion dice que requerimos el API KEY si no lo ponemos nos pone error
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`; // ENDPOINT DINAMICO, GUARDO UNA FUNCION 
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'; 



const spanError = document.getElementById('error'); // aqui le agregamos este span que captura todos los errores , a cualquier elemento que tenga ese id 
// cada vez que llame a fetch y tenga error entonces lo vamos a mostrar

async function loadRandomMichis() { // GET
    const Rta = await fetch(API_URL_RANDOM) // llamamos a la API // nos dice como esta en status code 
    const Data = await Rta.json(); // Convirtiendo eso en sintaxys que js lo entienda - llamamos a json  
    console.log('Random');
    console.log(Data); //

    //vamos a hacer una validacion de si status code es algo diferente de 200 
    if(Rta.status !== 200){ 
        spanError.innerHTML='Hubo un error' + Rta.status;
    } else{ 
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');           //solo estamos llamando a 3 elementos de HTML 
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        img1.src = Data[0].url;
        img2.src = Data[1].url;      // le estamos cambiando el SRC de cada imagen con lo que nos trae el API  

        btn1.onclick = () => saveFavouritesMichis(Data[0].id); // debemos llamar la funcion dentro de otra funcion, solo se ejecuta antes de definirla, solo por estar ahi 
        btn2.onclick = () => saveFavouritesMichis(Data[1].id); // aqui hasta que le demos click es que se ejecuta 
      
    }
}

//se recomienda crear las funciones completas de nuevo
// revisar el API para favoritos, esas API cargamos esas solicitudes especificas, tendremos nuestros query parameters
// QUueremos agregar articles 

async function loadFavouriteMichis() { // solo guardamos los favoritos 
    const Rta = await fetch(API_URL_FAVOURITES, { // Podemos definirlo por defecto el API KEY 
        method: 'GET',
        headers: {
            'X-API-KEY': 'f4579016-a4ad-422a-bb90-499f4bddc8e3',
        }
    }); // llamamos a la API
    const Data = await Rta.json(); // Convirtiendo eso en sintaxys que js lo entienda 
    console.log('Favorites')
    console.log(Data); 

    if(Rta.status !== 200){
        spanError.innerHTML='Hubo un error ' + Rta.status + Data.messsage;
    }else{ // vamos a coger la url, recorrer cada elemento del Data y sacar esa URL 

        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis Favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        Data.forEach(michi => {
            
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');    
            const btntext = document.createTextNode('Sacar al Michi de favoritos');

            img.src = michi.image.url; 
            img.width = 150;
            btn.appendChild(btntext);
            btn.onclick = () => deleteFavouritesMichis(michi.id)
            article.appendChild(img); // le estamos diciendo que a article metele la imag  y el boton cada vez que se de en favoritos
            article.appendChild(btn);
            section.appendChild(article)
            
        })
    }

}

// crear una funcion asincrona para guardar a los michis en favorites
// mandar a llamar la funcion, y en el html 

async function saveFavouritesMichis(id){ // POST // pedimos el id, para que sea dinamico
    // const res = await fetch(API_URL_FAVOURITES, { // si queremos otra cosa que no sea GET debemos pasar otro argumento que es un objeto con los atribujtos por defecto
    //     method: 'POST',  // hicimos la solicitud , debemos decirle a fetch que cuando estemos con un post envie todas las demas cosas x, headers, y biody 
    //     headers : { // ese Methopd puede cambiar a lo que sea 
    //         'content-Type': 'application/json', // lenguaje comun con el   que hablaremos con el backend 
    //         'X-API-KEY': 'f4579016-a4ad-422a-bb90-499f4bddc8e3',
    //     },
    //     body: // especificamos que michi es el que queremos, la info que le enviamos al backend , guardame esta imagen  
    //         JSON.stringify({
    //             image_id: id  // para estar seguros de que todo es correcto y nuestro backend entiende, le pasamos todo comos string 
    //         }), // cada objeto tiene una propiedad de tipo id -- siempre estamos guardando el mismo michi  
    //     }); 
        
    // const data = await res.json();
    

    // CON AXIOS  
        //    axios ya lo stringifea, el obvjeto res ya trae data por denttro 
        // vamos a poder llamarlo de esa manera , el primer argumento es la parte que nos falta, y axios la concatena 
        
        const {data, status} = await api.post( '/favourites', {
            //LLAMA AL METODO
            image_id : id,  //BOPY
        }); 
 
    console.log('Save')

    if(status !== 200){
        spanError.innerHTML='Hubo un error  ' + status + ' ' + data.message;
    }else{
        console.log('Michi guardado en favortios')
        loadFavouriteMichis();
    }

}


async function deleteFavouritesMichis(id){  // DELETE esta no recibe header, o body , como no enviamos body no tenemos que decirle que idioma esta 
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), { 
        method: 'DELETE', 
        headers:{
             'X-API-KEY': 'f4579016-a4ad-422a-bb90-499f4bddc8e3',
            }
        });
        
    const data = await res.json();
    
    console.log('delete')
    console.log(data)

    if(res.status !== 200){
        spanError.innerHTML='Hubo un error  ' + res.status + ' ' + data.message;
    }else{
        console.log('Michi eliminado en favortios')
        //volvemos a llamar a la funcion load favorites para que no tengamos que recargar la pagina 
        loadFavouriteMichis();
    }
}


async function uploadMichiPhoto(){
    //crear instancias del prototipo de Form Data 
    //podemos usarlo en nuestro formularios HTML  
    const form = document.getElementById('uploadingForm') // esa el id que tiene mi formulario
    const formData = new FormData(form); // creamos una instancia y le enviamos un argumento de form, que es el que trae todos los INPUTS del formulario
    // se pasan al FormDate y este toma todos los inputs y los ordena en un objeto, aqui estamos tomando el valor de los inputs
    // ahora falta poner el key de los inputs que sera el name de las etiquetas input  
    console.log(formData.get('file')) // este es el key 

    const res =  await fetch(API_URL_UPLOAD, {
        method:'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',  // llamamos el tipo de contenido, y necesita mas parametros
            'X-API-KEY': 'f4579016-a4ad-422a-bb90-499f4bddc8e3',
        },
        body: formData, //ya no neceitamos json.stringify y seleccionar cada input, guardamos el formData que es todo nuestro formulario
    })

    const data = await res.json();

    if(res.status !== 201){
        spanError.innerHTML='Hubo un error  ' + res.status + ' ' + data.message;
    }else{
        console.log('Foto de Michi Subida')
        //volvemos a llamar a la funcion load favorites para que no tengamos que recargar la pagina 
        console.log({data})
        console.log(data.url)
        saveFavouritesMichis(data.id);
    }
}

    

loadRandomMichis();
loadFavouriteMichis()



