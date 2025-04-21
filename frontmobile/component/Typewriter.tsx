import { useState, useEffect } from 'react';
import { Text } from 'react-native';


interface TypewriterProps {
    text: string;
    delay?: number;     
    infinite?: boolean;
}

const Typewriter : React.FC<TypewriterProps>= ({ text, delay, infinite }) =>{
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(()=>{
        let timeout;
        if (currentIndex <= text.length){
            timeout = setTimeout(()=>{
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            },delay)
        }else if (infinite) {
            setCurrentIndex(0);
            setCurrentText('');
        }

        return () => clearTimeout(timeout);
    },[currentIndex, delay, infinite, text])

    return <Text className="font-bold">{currentText}</Text>;
}

export default Typewriter;