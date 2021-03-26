import React, { Component } from 'react';
import firebase from './firebase.js';

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
        skill: '',
        project: '',
        data: {
            'skill1': {
                'project1': 4,
                'project2': 7,
                'project3': 1,
            },
            'skill2': {
                'project1': 9,
                'project2': 0,
            },
            'skill3': {
            },
            'skill4': {
                'project1': 9,
                'project2': 10,
            },  
      },
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const skillsRef = firebase.database().ref('skills');
        const skill = {
            name: this.state.skill,
            projects: {},
        }
        skillsRef.push(skill);
        this.setState({
            skill: '',
            project: '',
        });
    }

    componentDidMount() {
        const skillsRef = firebase.database().ref('skills');
        skillsRef.on('value', (snapshot) => {
            let data = snapshot.val();
            let newState = [];
            for (let skill in data) {
                
                const name = data[skill].name;
                const projects = data[skill].projects;
                if(projects){
                    newState[name] = projects;
                }else{
                    newState[name] = {};
                }
                
            //     newState.push({
            //         id: skill,
            //         title: data[skill].title,
            //         user: data[skill].user
            //     });
            }
            this.setState({
                data: newState,
            });
        });
    }

    renderData(){
        const dataCopy = this.state.data;
        let renderedData = [];
        const skillKeys = Object.keys(dataCopy);
        const FORMAT = ": "
        for(const skill in skillKeys){
            // alert([skillKeys[skill]]);
            const currentSkill = skillKeys[skill];
            renderedData.push(
                
                <p>{[currentSkill]}</p>
            )
            const projKeys = Object.keys(dataCopy[currentSkill])
            for(const project in projKeys){
                const currentProject = projKeys[project];
                renderedData.push(
                <p>
                    {currentProject}
                    {FORMAT}
                    {dataCopy[currentSkill][currentProject]}
                </p>
                )
            }
        }
        return renderedData;

    }

    render(){
        return(
            <div className="MainContainer">
                <header>
                    <div className="wrapper">
                        <h1>CraftTrack</h1>        
                    </div>
                </header>
                <div className='container'>
                    <section className='add-item'></section>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="skill" placeholder="new skill" onChange={this.handleChange} value={this.state.skill} />
                            <button>Add Skill</button>
                        </form>
                    <section/>
                    {this.renderData()}
                </div>
            </div>
        
        );
    }
}