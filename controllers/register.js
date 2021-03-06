const saltRounds = 10;

const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if(!email || !email.trim().length || !name || !name.trim().length || !password || !password.trim().length) {
        res.status(400).json("Unable to register")
    } 
    else {
   const hash =  bcrypt.hashSync(password, saltRounds) ;
   db.transaction(trx => {
       trx.insert({
           hash: hash,
           email: email
       })
       .into('login')
       .returning('email')
       .then(loginEmail => {
           return db('users')
    .returning('*')
    .insert({
        email: loginEmail[0].email,
        name: name,
        joined: new Date()
    })
     .then(user => {
        res.json(user[0])
    })
       })
       .then(trx.commit)
       .catch(trx.rollback)
   }) 
    .catch( err => {
      //  console.log(err)
        res.status(400).json("Unable to register")
    })
}
}

module.exports = {handleRegister: handleRegister};