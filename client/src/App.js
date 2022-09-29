// ./src/App.js

import React, { useState } from 'react';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './azure-cognitiveservices-computervision';

function App() {
  
  const [fileSelected, setFileSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const handleChange = (e) => {
    e.preventDefault();
    setFileSelected(e.target.value)
  }
 

  const onFileUrlEntered = (e) => {

    // hold UI
    setProcessing(true);
    setAnalysis(null);

    computerVision(fileSelected || null).then((item) => {
      // reset state/form
      setAnalysis(item);
      setFileSelected("");
      setProcessing(false);
    });
   
  };

  const handSubmit =async (data) =>{
    try{
      const res = await fetch("https://appservice02-ab2022ii.azurewebsites.net/todos",{
      method: 'POST',
      body:JSON.stringify(data),
      headers: {"Content-Type":"application/json"},
    }
    )
    const data123= await res.json();
     console.log(data123);
    }catch(err){
      console.log(err.message)
    }
    
  }
  // Display JSON data in readable format
  const PrettyPrintJson = (data) => {
    handSubmit(data)
    console.log(data);
    let tags = [];
    let texto='';
    for(let i=0;i<data.text.readResults[0].lines.length;i++){
         texto += `${data.text.readResults[0].lines[i].text} `
        }
    for (let i=0 ; i<data.tags.length;i++){
            tags[i]=data.tags[i].name;
    }
    let dataTags = tags.map((lista)=> <li key={lista}>{lista}</li>);
    return (<div className='ulTags'><ul> Analisis de la imagen por la IA<li><b>{JSON.stringify(data.description.captions[0].text)}</b></li></ul>
      Tags:<ul >{dataTags}</ul> TextoConstruido <ul><li>{texto}</li></ul>
      </div>
    );
  }

  const DisplayResults = () => {
    
    return (
      <div className='Result'>
        <h2>Computer Vision Analysis</h2>
        <div className='Results2'>
        <div>
          <img src={analysis.URL} height="200" border="1" alt={(analysis.description && analysis.description.captions && analysis.description.captions[0].text ? analysis.description.captions[0].text : "can't find caption")} />
          </div>
        {PrettyPrintJson(analysis)}
        </div>
      </div>
    )
  };
  
  const Analyze = () => {
    return (
    <div className='container2'>
      <h1 className="tittle">Analizar Imagen</h1>
      {!processing &&
        <div className='container3'>
          <div className='container-url'>
            <label>Ingrese Url <b> →</b></label>
            <input type="text" placeholder="Enter URL or leave empty forimage from collection" size="70" onChange={handleChange}></input>
          </div>
          <button onClick={onFileUrlEntered}>Analizar</button>
        </div>
      }
      {processing && <div>Processing</div>}
      {analysis && DisplayResults()}
      
      </div>

    )
  }
  
  const CantAnalyze = () => {
    return (
      <div>Key and/or endpoint not configured in ./azure-cognitiveservices-computervision.js</div>
    )
  }
  
  function Render() {
    const ready = ComputerVisionIsConfigured();
    if (ready) {
      return <Analyze />;
    }
    return <CantAnalyze />;
  }

  return (
    <div className='container1'>
      {Render()}
      </div>
  );
}

export default App;
