//npm start - comando para iniciar o servidor (usar no terminal)
// configurando o servidor
const express = require("express")
const server = express()


//configurar o servidor para arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended: true}))


//configurar a conexao com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})



// configurar a apresentacao da pagina
server.get("/", function(req, res){
    
    
    db.query("select * FROM donors", function(err, result){
        if (err) return res.send("erro de banco de dados.")


        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatorios.")
    }


    //colocar valores dentro do banco de dados
    const query= `
    INSERT INTO donors("name", "email", "blood") 
    VALUES ($1, $2, $3)`
    
    const VALUES = [name, email, blood]

    db.query(query, VALUES, function(err){
        if (err) return res.send("erro no banco de dados.")
        
        
        return res.redirect("/")        
    })
})



// ligar servidor e permitir acesso na porta 3000
server.listen(3000 , function(){
    console.log("iniciei o servidor!")
})