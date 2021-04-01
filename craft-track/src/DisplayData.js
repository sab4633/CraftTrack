import React, { Component } from 'react';
import firebase from './firebase.js';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

const data = [
    {
      data: {
        battery: 0.7,
        design: .8,
        useful: 0.9,
        speed: 0.67,
        weight: 0.8
      },
      meta: { color: 'orange' }
    },
    // {
    //   data: {
    //     battery: 0.6,
    //     design: .85,
    //     useful: 0.5,
    //     speed: 0.6,
    //     weight: 0.7
    //   },
    //   meta: { color: 'red' }
    // }
  ];

const captions = {
    // columns
    battery: 'Battery Capacity',
    design: 'Design',
    useful: 'Usefulness',
    speed: 'Speed',
    weight: 'Weight'
  };




export default class DisplayData extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
            skillIds: {},
            projectIds: {},
            skillsArray: [],
            captions: {},
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
                captions: this.getCaptions(),
            })
        });
    }

    getSkillArray(){
        const dataCopy = {...this.state.data};
        let newData = [];
        let skillArray = {};
        for(const skill in dataCopy){
            let totalTime = 0;
            const currentSkill = dataCopy[skill];
            for(const proj in currentSkill){
                totalTime += currentSkill[proj];
            }
            skillArray[skill] = totalTime;

        }
        const testFormatIssue = {
            Programming: 8.5,
            Film: 3.5
        }
        // newData = [{
        //     data: skillArray,
        //     meta: { color: 'orange' }
        // }];
        newData = [{
            data: testFormatIssue,
            meta: { color: 'orange' }
        }];
        return newData;
        
    }

    getCaptions(){
        const dataCopy = this.state.data;
        let caption = {};
            for(const skill in dataCopy){
                caption[skill] = skill;
            }
        return caption;
    }


    render(){
        const testCaptions = {
            Programming: 'Programming',
            Film: 'Film',
        }
        const data = [
            {
                subject: 'Math', A: 120, B: 110, fullMark: 150,
            },
            {
                subject: 'Chinese', A: 98, B: 130, fullMark: 150,
            },
            {
                subject: 'English', A: 86, B: 130, fullMark: 150,
            },
            {
                subject: 'Geography', A: 99, B: 100, fullMark: 150,
            },
            {
                subject: 'Physics', A: 85, B: 90, fullMark: 150,
            },
            {
                subject: 'History', A: 65, B: 85, fullMark: 150,
            },
        ];

        return( 
            
            <div>]
                <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Mike" dataKey="B" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
			    </RadarChart>
            </div>
        );
    }
}