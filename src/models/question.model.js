export const RIORDINA="RIORDINA"
export const QA="QA"
export const MULTIPLA="MULTIPLA"

class Question {
    q;
    a;
    t; // RIORDINA, QA, MULTIPLA

    constructor(q="",a="",t="QA") {
        this.q=q
        this.a=a
        this.t=t
    }
}


export default Question