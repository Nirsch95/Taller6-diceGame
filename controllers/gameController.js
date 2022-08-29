const game = require('../models/game');
const Game = require('../models/game');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Muestra la página principal, puede escogerse crear o ver los juegos.
 */
 const indexGet = (req, res) => {
    res.render('index', { title: 'Dice Game' });
}

/**
 * Permite llenar el formulario para crear un juego
 * Puede visualizarse en la siguiente url localhost:8080/createGame
 */
const gameCreateGet = (req, res) => {
    res.render('create', { title: 'Dice Game' });
}

/**
 * Premite crear el juego con los datos suministrados por el usuario.
 */
const gameCreatePost = async(req, res) => {
    const game = new Game({
        id: req.body.id,
        type: req.body.type,
        gamers: req.body.gamers
    });

    game.save()
        .then((result) => { res.json({
            "id": result._id,
            "type": result.type,
            "gamers": [
                result.gamers[0].name,
                result.gamers[1].name,
                result.gamers[2].name]
        })})
        .catch((err) => {res.json(err)});
}

/**
 * Permite el registro de las apuestas de los jugador por parte del usuario
 * Puede visualizarse en la siguiente url localhost:8080/startGame
 */
const startGameGet = (req, res) => {
    res.render('start', { title: 'Dice Game' });
}

/**
 * Función para generar un número aleatoreamente a partir de un rango.
 * @param {valor mínimo del rango} min 
 * @param {valor máximo del rango} max 
 * @returns 
 */
function numRand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

/**
* Permite empezar el juego, indicando las apuestas de los jugadores y generando un valor aleatorio.
*/
const startGamePost = (req, res) => {
    let body = req.body;
    for (let i = 0; i < 3; i++) {
        Game.findOne({_id: body._id})
        .then( (result) => Game.updateOne({ _id : body._id },
            {$set: 
                {"gamers.$[gamer].bet": body.gamers[i].bet}},
                {arrayFilters:[{"gamer._id": {$eq: ObjectId(result.gamers[i]._id)}}]}))
        .catch((err) => {res.json(err)});
    } 
    setTimeout(()=> {Game.findOne({_id: body._id})
    .then((result) => { res.json({
        "id": result._id,
        "type": "",
        "gamerBet": {
            [result.gamers[0]._id] : result.gamers[0].bet,
            [result.gamers[1]._id] : result.gamers[1].bet, 
            [result.gamers[2]._id] : result.gamers[2].bet
    }})})
    .catch((err) => {res.json(err)})}, 500)
    Game.findOne({_id: body._id})
    .then(result =>  {
        let num = numRand(1,6)
        console.log(num)
        for (let i = 0; i < 3; i++) {
            if (num === result.gamers[i].bet){
                Game.updateOne({ _id : body._id }, {
                    $set: {
                        winner: { name: result.gamers[i].name}}}).catch(err => console.log(err))
            break
            }
        }

    })
}

/**
 * Permite mostrar los datos requeridos del ganador de la partida.
 */
const winnerGet = (req, res) => {
    const id = req.params.id;
    let winExist = false;
    Game.findById(id)
    .then(result => {
    for (let i = 0; i < 3; i++) {
        if (result.gamers[i].name === result.winner.name){
            {res.json({
                "id": result.gamers[i]._id,
                "name": result.winner.name
            })}
            winExist = true;
            break
        }}
    })
    Game.findById(id)
    .then(() => {
    if (winExist === false)
    {res.json({
            "winner": "No hay ganador, por favor vuelva a iniciar el juego"
        })}}
    )
    .catch((err) => {res.json(err)});
}
        


/**
 * Permite mostrar todos los juegos creados en un json
 */
 const games = (req, res) => {
    const data = Game.find({
        $or: [
          { 'delete': {$eq: false } },
          { 'delete': { $exists: false } },
        ]
      });
      data
        res.render('games', { title: 'Dice Game' })
        .then(result => res.json(result))
        .catch(err => console.log(err));
}

/**
 * Permite obtener la información de un juego específico de la manera deseada.
 */
const gameDetails = async(req, res) => {
    const id = req.params.id;
    let winExist = false;
    Game.findById(id)
    .then((result) => { 
        for (let i = 0; i < 3; i++) {
            if (result.gamers[i].name === result.winner.name) 
                { res.json({
                "id": result._id,
                "gamers": {
                    [result.gamers[0]._id] : {
                        "id": result.gamers[0]._id,
                        "name": result.gamers[0].name},
                    [result.gamers[1]._id] : {
                        "id": result.gamers[1]._id,
                        "name": result.gamers[1].name},
                    [result.gamers[2]._id] : {
                        "id": result.gamers[2]._id,
                        "name": result.gamers[2].name},
                },
                "inProgress": false,
                "winner": {
                    "id": result.gamers[i]._id,
                    "name": result.winner.name
                }}
                )
                winExist = true;
                break
            } }})
    Game.findById(id)
    .then((result) => {
            if (winExist === false) {res.json({
                "id": result._id,
                "gamers": {
                    [result.gamers[0]._id] : {
                        "id": result.gamers[0]._id,
                        "name": result.gamers[0].name},
                    [result.gamers[1]._id] : {
                        "id": result.gamers[1]._id,
                        "name": result.gamers[1].name},
                    [result.gamers[2]._id] : {
                        "id": result.gamers[2]._id,
                        "name": result.gamers[2].name},
                "inProgress": true
                }
        })}})
    .catch((err) => {res.json(err)});
}

module.exports = {
    indexGet,
    gameCreateGet,
    gameCreatePost,
    startGameGet,
    startGamePost,
    winnerGet,
    games,
    gameDetails,
}
