/**
 * Created by tanjiasheng on 2017/5/12.
 */

class dgComponent {
    constructor(props) {
        this.vDom = props.vDom;
        this.vExp = props.vExp;
        this.conEle = props.conEle;
        this.scope = props.scope;
    }
    onLoad() {
        console.info('load success');
    }
    onUpdate() {
        console.info('update success');
    }
}

export default dgComponent;