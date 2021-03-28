import React, { Component } from 'react';
import firebase from './firebase.js';
import RadarChart from './RadarChart';

const INDENT = "-----";
const INITIAL_TIME = 0;

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
        skill: '',
        project: '',
        time: '',
        data: {},
        skillIds: {},
        projectIds: {},
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddProject = this.handleAddProject.bind(this);
    this.handleAddTime = this.handleAddTime.bind(this);
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
        });
    }

    handleAddProject(e) {
        e.preventDefault();
        const skillId = this.state.skillIds[document.getElementById('skills-selector').value];
        const projects = firebase.database().ref(`/skills/${skillId}/projects`);
        const newProject = {
            name: this.state.project,
            time: INITIAL_TIME,
        }
        projects.push(newProject);

        this.setState({
            project: '',
        });
    }

    handleAddTime(e) {
        e.preventDefault();
        const projName = document.getElementById('project-selector').value;
        const skillName = this.getSkillId(projName);
       
        const project = firebase.database().ref(`/skills/${this.state.skillIds[skillName]}/projects/`);
        
        const newTime = parseFloat(this.state.time)+this.state.data[skillName][projName];
        
        const newProject = {
            name: projName,
            time: newTime,
        }
        
        project.remove();
        project.push(newProject);

        this.setState({
            time: '',
        });
    }

    getSkillId(projName){
        const dataCopy = {...this.state.data};
        for(const skill in dataCopy){
            const projects = dataCopy[skill];
            if(projects){
                for( const proj in projects){
                    if(proj === projName){
                        return skill;
                    }
                }
            }
            
        }
        return "";
    }

    componentDidMount() {
        const skillsRef = firebase.database().ref('skills');
        skillsRef.on('value', (snapshot) => {
            let dbData = snapshot.val();
            let newData = {};
            let newIds = {};
            let projIds = {};
            for (let skill in dbData) {
                const name = dbData[skill].name;
                const projects = dbData[skill].projects;
                newIds[name] = skill;
                if(projects){
                    const newProjects = {}
                    for(let proj in projects){
                        projIds[projects[proj].name] = proj;
                        newProjects[projects[proj].name] = projects[proj].time; 
                        
                    }
                    newData[name] = newProjects;
                }else{
                    newData[name] = {};
                }
            }
            this.setState({
                data: newData,
                skillIds: newIds,
                projIds: projIds,
                
            });
        });
    }

    renderData(){
        const dataCopy = {...this.state.data};
        let renderedData = [];
        const skillKeys = Object.keys(dataCopy);
        const FORMAT = ": "
        for(const skill in skillKeys){
            const currentSkill = skillKeys[skill];
            renderedData.push(
                <p>
                   
                    {currentSkill}
                    <button onClick={() => this.removeSkill(this.state.skillIds[currentSkill])}>-</button>
                </p>
            )
            const projKeys = Object.keys(dataCopy[currentSkill])
            for(const project in projKeys){
                const currentProject = projKeys[project];
                renderedData.push(
                <p>
                    {INDENT}
                    {currentProject}
                    {FORMAT}
                    {dataCopy[currentSkill][currentProject]}
                    <button onClick={() => this.removeProject(this.state.skillIds[currentSkill],this.state.projIds[currentProject])}>-</button>
                </p>
                )
            }
        }
        return renderedData;

    }

    renderSkillOptions(){
        let options = [];
        const dataCopy = {...this.state.data};
        const skills = Object.keys(dataCopy);
        skills.forEach(skill =>
            options.push(
                <option value={skill}>{skill}</option>
            )  
        );
        return options;
    }

    renderProjectOptions(){
        let options = [];
        const dataCopy = {...this.state.data};
        for(const skill in dataCopy){
            const projects = dataCopy[skill];
            if(projects){
                for( const proj in projects){
                    options.push(
                        <option value={proj}>{proj}</option>
                    )
                }
            }
            
        }
        return options;
    }

    removeSkill(skillId) {
        const itemRef = firebase.database().ref(`/skills/${skillId}`);
        itemRef.remove();
    }

    removeProject(skillId, projId) {
        const itemRef = firebase.database().ref(`/skills/${skillId}/projects/${projId}`);
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
                    <section className='add-skill'></section>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="skill" placeholder="new skill" onChange={this.handleChange} value={this.state.skill} />
                            <button>Add Skill</button>
                        </form>
                    <section/>
                    <section className='add-project'></section>
                        <form onSubmit={this.handleAddProject}>
                            <input type="text" name="project" placeholder="new project" onChange={this.handleChange} value={this.state.project} />
                            <select name="skills-selector" id="skills-selector">
                                {this.renderSkillOptions()}
                            </select>
                            <button>Add Project</button>
                        </form>
                    <section/>
                    <section className='add-time'></section>
                        <form onSubmit={this.handleAddTime}>
                            <input type="number" name="time" placeholder="add time" onChange={this.handleChange} value={this.state.time} />
                            <select name="project-selector" id="project-selector">
                                {this.renderProjectOptions()}
                            </select>
                            <button>Add Time</button>
                        </form>
                    <section/>
                    {this.renderData()}
                    <RadarChart/>
                </div>
            </div>
            
        );
    }
}