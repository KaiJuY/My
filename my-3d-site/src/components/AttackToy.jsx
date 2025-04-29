import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

function AttackToy({ url, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], onClick }) {
    const { scene } = useGLTF(url);
    const ref = useRef();
    const { actions, names } = useAnimations(scene.animations, ref);
    const [currentAnimation, setCurrentAnimation] = useState('idle');
    const [playAnimation, setPlayAnimation] = useState(null);

    useEffect(() => {
        if (playAnimation && playAnimation !== currentAnimation) {
          // 停止當前動畫
          if (actions[currentAnimation]) {
            actions[currentAnimation].fadeOut(0.5);
          }
          
          // 播放新動畫
          if (actions[playAnimation]) {
            actions[playAnimation].reset().fadeIn(0.5).play();
            setCurrentAnimation(playAnimation);
            
            // 如果是一次性動畫(如攻擊)，可以設置完成後返回idle
            if (playAnimation === 'attack') {
              const duration = actions[playAnimation].getClip().duration;
              setTimeout(() => {
                actions[playAnimation].fadeOut(0.5);
                actions['idle'].reset().fadeIn(0.5).play();
                setCurrentAnimation('idle');
              }, duration * 1000); // 轉換為毫秒
            }
          }
        }
    }, [playAnimation, actions, currentAnimation]);

    // 初始化時播放idle動畫
    useEffect(() => {
      console.log('Available animations:', names)
    }, [actions, names]);
  
    // useFrame(() => {
    //     if(ref.current.position.y > 0.5) {
    //         postionChange = -0.005;
    //     }    
    //     else{
    //         postionChange = 0.005;
    //     }
    //     ref.position.y += positionChange;
    // });
    return (
        <primitive
            ref={ref}
            object={scene}
            position={position}
            scale={scale}
            rotation={rotation}
            onClick={onClick}
        />
    );
}

export function AttackToyModel() {
    const [playAnimation, setPlayAnimation] = useState(null);

    const handleClick = (animName) => {
        console.log("click", animName);
        setPlayAnimation(animName);
    }

    return (
        <mesh>
            <AttackToy
                url={`${import.meta.env.BASE_URL}models/attacktoy.glb`}
                position={[0, 0, 0]}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
                onClick={() => handleClick('Attack')}/>
        </mesh>
    )
}
