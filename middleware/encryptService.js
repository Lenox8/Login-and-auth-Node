import bcrypt from 'bcrypt';


async function hash () {
    // usar este ou this, orientacao a objeto, se refere ao docmento sendo salvo
    if(!this.isModified('password')) return

    try {
        const hashTime = 10
        this.password = await bcrypt.hash(this.password, hashTime)

    } catch (error) {
        console.log(error);
        
    }
}

export default hash;
