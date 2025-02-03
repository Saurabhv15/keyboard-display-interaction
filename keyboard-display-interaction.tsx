import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowDown, Monitor, Keyboard, Cpu, Database } from 'lucide-react';

const ComponentTooltip = ({ title, description, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute bottom-full mb-2 w-64 bg-black text-white p-3 rounded-lg shadow-lg z-10">
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm">{description}</p>
    </div>
  );
};

const KeyboardDisplayInteraction = () => {
  const [inputText, setInputText] = useState('');
  const [processingChar, setProcessingChar] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedText, setProcessedText] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Add window resize listener
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const componentInfo = {
    keyboard: {
      title: "Keyboard Input Stage",
      description: "Converts physical key presses into electrical signals. Each key press generates a unique scan code that identifies which key was pressed or released."
    },
    controller: {
      title: "Keyboard Controller",
      description: "Translates scan codes into keycodes. It handles key rollover, manages keyboard buffer, and communicates with the OS through interrupts."
    },
    os: {
      title: "Operating System Processing",
      description: "Interprets keycodes, manages keyboard input events, applies keyboard layouts, and handles character encoding. Also manages input focus and event distribution."
    },
    buffer: {
      title: "Display Buffer",
      description: "Temporary storage that holds character data before rendering. Manages text positioning, formatting, and coordinates with the display controller for screen updates."
    },
    display: {
      title: "Display Output",
      description: "Renders characters on screen. Handles font rendering, character positioning, cursor management, and screen refresh operations."
    }
  };

  const steps = [
    { id: 0, title: 'Keyboard Input', description: 'Converting text to scan codes' },
    { id: 1, title: 'Controller Processing', description: 'Converting scan codes to keycodes' },
    { id: 2, title: 'OS Processing', description: 'Processing input stream' },
    { id: 3, title: 'Buffer Update', description: 'Updating display buffer' },
    { id: 4, title: 'Display Output', description: 'Rendering to screen' }
  ];

  const processText = async () => {
    if (!inputText.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setProcessedText('');
    
    for (let i = 0; i < inputText.length; i++) {
      const currentChar = inputText[i];
      
      for (let step = 0; step < steps.length; step++) {
        setCurrentStep(step);
        setProcessingChar(currentChar);
        
        if (step === steps.length - 1) {
          setProcessedText(prev => prev + currentChar);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setCurrentStep(-1);
    setIsProcessing(false);
    setProcessingChar('');
  };

  const getStepColor = (stepId) => {
    if (!isProcessing) return 'text-gray-400';
    return currentStep >= stepId ? 'text-green-500' : 'text-gray-400';
  };

  const getArrowColor = (stepId) => {
    if (!isProcessing) return 'text-gray-400';
    return currentStep >= stepId ? 'text-green-500 scale-110' : 'text-gray-400';
  };

  const ArrowComponent = isSmallScreen ? ArrowDown : ArrowRight;

  const ProcessingStage = ({ type, icon: Icon, tooltipKey }) => (
    <div 
      className={`relative flex flex-col items-center transition-all duration-300 ${getStepColor(steps.find(s => s.title.toLowerCase().includes(type.toLowerCase()))?.id || 0)}`}
      onMouseEnter={() => setActiveTooltip(tooltipKey)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      <ComponentTooltip 
        title={componentInfo[tooltipKey].title}
        description={componentInfo[tooltipKey].description}
        isVisible={activeTooltip === tooltipKey}
      />
      <Icon className="w-8 h-8 md:w-12 md:h-12 cursor-help" />
      <div className="text-sm mt-2 text-center">
        <div>{type}</div>
        <div className="font-mono bg-gray-200 px-2 py-1 rounded min-w-[20px]">
          {currentStep === steps.find(s => s.title.toLowerCase().includes(type.toLowerCase()))?.id ? processingChar || '-' : '-'}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Text Processing Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {/* Input Section */}
          <div className="w-full flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to process..."
              className="flex-1 p-2 border rounded"
              disabled={isProcessing}
            />
            <button
              onClick={processText}
              disabled={isProcessing || !inputText.trim()}
              className={`px-4 py-2 rounded ${
                isProcessing || !inputText.trim() 
                  ? 'bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Process
            </button>
          </div>

          {/* Process Flow Visualization */}
          <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} items-center justify-between w-full px-2 md:px-4 space-y-4 md:space-y-0`}>
            <ProcessingStage type="Input" icon={Keyboard} tooltipKey="keyboard" />
            <ArrowComponent className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${getArrowColor(1)}`} />
            <ProcessingStage type="Controller" icon={Cpu} tooltipKey="controller" />
            <ArrowComponent className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${getArrowColor(2)}`} />
            <ProcessingStage type="OS" icon={Cpu} tooltipKey="os" />
            <ArrowComponent className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${getArrowColor(3)}`} />
            <ProcessingStage type="Buffer" icon={Database} tooltipKey="buffer" />
            <ArrowComponent className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${getArrowColor(4)}`} />
            <ProcessingStage type="Display" icon={Monitor} tooltipKey="display" />
          </div>

          {/* Current Step Description */}
          <div className="bg-gray-100 p-3 md:p-4 rounded-lg w-full">
            <div className="font-medium text-base md:text-lg">
              {isProcessing ? steps[currentStep].title : 'Waiting for input...'}
            </div>
            <div className="text-gray-600 text-sm md:text-base">
              {isProcessing ? steps[currentStep].description : 'Enter text and click Process to start'}
            </div>
          </div>

          {/* Display Output */}
          <div className="w-full bg-black rounded-lg p-4 md:p-6 flex justify-center items-center min-h-[80px] md:min-h-[100px]">
            <div className="text-white font-mono text-base md:text-lg break-all">
              {processedText ? `Output: ${processedText}` : 'Waiting for input...'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyboardDisplayInteraction;
