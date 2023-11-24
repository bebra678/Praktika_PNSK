let eventBus = new Vue()
Vue.component('columns', {
    props:{
    },
    template:`
    <div id="cols">
        <fill></fill>
        <p v-if="errors.length"
        v-for="error in errors">
            {{ error }}
        </p>
        <col1 class="col" :column1="column1"></col1>
        <col2 class="col" :column2="column2"></col2>
        <col3 class="col" :column3="column3"></col3>
    </div>
    `,
    data() {
        return {
            errors:[],
            column1:[],
            column2:[],
            column3:[],
        }
    },
    methods:{
    },
    mounted(){
        eventBus.$on('card-submitted', card =>{
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(card)
                console.log()
            } else {
                this.errors.push('You can\'t add new cards now')
            }
        })

        eventBus.$on('to-column2', card => {
            this.errors = []
            if (this.column2.length < 5){
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card),1)
            }else{
                this.errors.push('Complete at least one task to add more')
            }
        })
    eventBus.$on('to-column3', card => {
        this.column3.push(card)
        this.column2.splice(this.column2.indexOf(card), 1)
    })
        eventBus.$on('to-column1-3', card =>{
            this.column3.push(card)
            this.column1.splice(this.column2.indexOf(card), 1)
        })
},



})

Vue.component('fill', {
        props: {
            column1: {
                type: Array,
                required: true
        },
        errors: {
            type: Array,
            required: true
        },
    },
    template: `
    <div class="form_">
        <form @submit.prevent="onSubmit" >
            <p> 
                <input required type="text" v-model="title" placeholder="Название">
            </p>
            <ul>
                <li>
                    <input required type="text" v-model="t1" placeholder="Заметка 1"> 
                </li>
                <li>
                    <input required type="text" v-model="t2" placeholder="Заметка 2">
                </li>
                <li>
                    <input required type="text" v-model="t3" placeholder="Заметка 3">
                </li>
                <li>
                    <input v-if="t1 != '' && t2 != '' && t3 != ''" type="text" v-model="t4" placeholder="Заметка 4">
                </li>
                <li >
                    <input v-if="t1 != '' && t2 != '' && t3 != '' && t4 != ''" type="text" v-model="t5" placeholder="Заметка 5">
                </li>
                <p>
                    <input type="submit" class="btn btn-primary" value="Добавить">
                </p>
            </ul>
        </form>
                   
    </div>
    `,
    data() {
    return{
        title: null,
        t1: '',
        t2: '',
        t3: '',
        t4: '',
        t5: '',
    }
},
methods:{
    onSubmit(){
        // if(this.t4 != '' && this.t5 == '')
        // {
        //     let card = {
        //         title: this.title,
        //         tasks: [{text: this.t1, completed: false},
        //             {text: this.t2, completed: false},
        //             {text: this.t3, completed: false},
        //             {text: this.t4, completed: false}],
        //         date: new Date().toLocaleString(),
        //         status: 0,
        //     }
        // }
        // if(this.t4 != '' && this.t5 != '')
        // {
        //     let card = {
        //         title: this.title,
        //         tasks: [{text: this.t1, completed: false},
        //             {text: this.t2, completed: false},
        //             {text: this.t3, completed: false},
        //             {text: this.t4, completed: false},
        //             {text: this.t5, completed: false}],
        //         date: new Date().toLocaleString(),
        //         status: 0,
        //     }
        // }
        let card = {
            title: this.title,
            tasks: [{text: this.t1, completed: false},
                {text: this.t2, completed: false},
                {text: this.t3, completed: false},
                {text: this.t4, completed: false},
                {text: this.t5, completed: false}],
            date: new Date().toLocaleString(),
            status: 0,
        }
        eventBus.$emit('card-submitted', card)
        this.title = null
        this.t1 = ''
        this.t2 = ''
        this.t3 = ''
        this.t4 = ''
        this.t5 = ''
        this.date = null
},
}
})

Vue.component('col1', {
    props:{
        column1:{
            type: Array,
            required: true
        },
        card: {
            type: Object,
            required: true
        },
        errors: {
            type: Array
        }
    },
    template:`
        <div>
            <h2>Выполняй скорее</h2>
            <div v-for="card in column1" :disabled="block">
                <p><b>Заголовок:</b>{{ card.title }}</p>
                <ul v-for="task in card.tasks"
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)"
                    :disabled="task.completed">
                    {{ task.text }}
                    </li>
                 </ul>
                  <p class="font"><b>Дата и время создания: </b><br>{{ card.date }}</p>
            </div>
        </div>
    `,
    data(){
        return{
            block: false
        }
    },

    computed:{
        blocked(){
            if (this.errors.length === 2) {
                this.block = true
            }
        }

    },
    methods:{
        updateStage(task, card){
            task.completed = true
            card.status = 0
            let length = 0

            for (let i = 0; i < 5; i++){
                if (card.tasks[i].text != null){
                    length++
            }
            }

            for( let i = 0; i<5; i++){
                if (card.tasks[i].completed === true){
                    card.status++
                }
            }

            if (card.status / length * 100 >=50 ){
                eventBus.$emit('to-column2', card)
            }

            if (card.status / length * 100 === 100){
                card.date = new Date().toLocaleString()
                eventBus.$emit('to-column1-3', card)
            }
        },
    }
})
Vue.component('col2', {
    props:{
        column2: {
            type: Array,
            required: true
        },
        card: {
            type: Object,
            required: true
        }
    },
    template:`
        <div>
            <h2>Осталось совсем чуть чуть</h2>
            <div v-for="card in column2">
                <p><b>Заголовок:</b>{{ card.title }}</p>
                <ul v-for="task in card.tasks"
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)" 
                    :disabled="task.completed">
                    {{ task.text }}
                    </li>
                 </ul>
            </div>
        </div>
    `,
    methods:{
        updateStage(task, card) {
            task.completed = true
            card.status = 0
            let length = 0

            for (let i = 0; i < 5; i++){
                if (card.tasks[i].text != null){
                    length++
                }
            }

            for( let i = 0; i<5; i++){
                if (card.tasks[i].completed === true){
                    card.status++
                }
            }

            if (card.status / length * 100 === 100 ){
                card.date = new Date().toLocaleString()
                eventBus.$emit('to-column3', card)
            }
        }
    }
})
Vue.component('col3', {
    props: {
        column3: {
            type: Array,
            required: true
        },
        card: {
            type: Object,
            required: true
        }
    },
    template: `
        <div>
            <h2>Всё выполнено, молодец</h2>
            <div v-for="card in column3">
                <p><b>Заголовок:</b>{{ card.title }}</p>
                <ul v-for="task in card.tasks"
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }">
                    {{ task.text }}
                    </li>
                 </ul>
                <p class="font"><b>Дата, время:</b>{{ card.date }}</p>      
            </div>
        </div>
    `,
})

    let app = new Vue({
        el:'#app',
        data: {
        }
    })