import React, { Component } from 'react';
import firebase from './firebase.js';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

export default class DisplayData extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
            skillIds: {},
            projectIds: {},
            skillsArray: [],
        }
   
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
            this.setState({
                skillArray: this.getSkillArray(),
            })
        });
    }

    getSkillArray(){
        const dataCopy = {...this.state.data};
        let skillData = [];
        for(const skill in dataCopy){
            
            let totalTime = 0;
            const currentSkill = dataCopy[skill];
            for(const proj in currentSkill){
                totalTime += currentSkill[proj];
            }
            let newSkill = {skill: skill, time: totalTime}
            skillData.push(newSkill);
        }
       
        return skillData;
        
    }

    render(){
        const skillData = this.getSkillArray();

        return( 
            <div>
                <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={skillData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis />
                    <Radar name="Skills" dataKey="time" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
			    </RadarChart>
            </div>
        );
    }
}