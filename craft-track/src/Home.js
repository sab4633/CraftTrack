import React, { Component } from 'react';
import firebase from './firebase.js';

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
        skill: '',
        project: '',
        data: {},
        ids: {},
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
            let dbData = snapshot.val();
            let newData = {};
            let newIds = {};
            for (let skill in dbData) {
                const name = dbData[skill].name;
                const projects = dbData[skill].projects;
                newIds[name] = skill;
                if(projects){
                    newData[name] = projects;
                }else{
                    newData[name] = {};
                }
            }
            this.setState({
                data: newData,
                ids: newIds,
                
            });
        });
    }

    renderData(){
        const dataCopy = this.state.data;
        let renderedData = [];
        const skillKeys = Object.keys(dataCopy);
        const FORMAT = ": "
        for(const skill in skillKeys){
            const currentSkill = skillKeys[skill];
            renderedData.push(
                <p>
                    {[currentSkill]}
                    <button onClick={() => this.removeItem(this.state.ids[currentSkill])}>Remove Item</button>
                </p>
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
    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/skills/${itemId}`);
        itemRef.remove();
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