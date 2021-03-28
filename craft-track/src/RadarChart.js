import React, { Component } from 'react';
import firebase from './firebase.js';
import Radar from 'react-d3-radar';

export default class RadarChart extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
            skillIds: {},
            projectIds: {},
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
        });
    }

    render(){
        return(
            <div>
                TEST
            </div>
        );
    }
}