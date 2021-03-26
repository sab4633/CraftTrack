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

handleChange(){

}

handleSubmit(){

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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="skill" placeholder="new skill" onChange={this.handleChange} value={this.state.skill} />
                    <input type="text" name="project" placeholder="new project" onChange={this.handleChange} value={this.state.project} />
                    <button>Add Skill</button>
                </form>
                    {this.renderData()}
                
            </div>
        );
    }
}