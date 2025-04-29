import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

function WhiteSharkModel() {
    const group = useRef()
    const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/white_shark.glb`)
    const { actions, names, mixer } = useAnimations(animations, group)
    const [isAttacking, setIsAttacking] = useState(false)
    const radius = 2 // 繞圈半徑
    const speed = 1 // 繞圈速度

    // 處理點擊事件
    const handleClick = (event) => {
      if (!isAttacking) {
        console.log('Attack2 animation found, starting...')
        setIsAttacking(true)
        actions['Attack2'].reset().fadeIn(0.5).play()
        setTimeout(() => {
          console.log('Attack2 animation finished')
          actions['Attack2'].fadeOut(0.5).stop()
          if (actions['Swim']) {
            actions['Swim'].reset().fadeIn(0.5).play()
          }
          setIsAttacking(false)
        }, 1000) // 1秒後恢復游泳
      } else {
        console.warn('Attack2 animation not found in actions:', Object.keys(actions))
      }
    }

    // 持續更新位置實現繞圈運動
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime() * speed * 0.5
        const x = Math.sin(time) * radius
        const z = Math.cos(time) * radius
        group.current.position.x = x
        group.current.position.z = z
        // 計算旋轉角度，使鯊魚沿著圓周運動方向
        group.current.rotation.y = Math.atan2(x, z) + Math.PI/2     
    })

    useEffect(() => {
      console.log('Available animations:', names)
      
      try {
        if(names.length > 0) {
          const action = actions['Swim']
          if(action) {
            action.reset().fadeIn(0.5).play()
          } else {
            console.warn('Animation action not found:', names[0])
          }
        } else {
          console.warn('No animations found in the model')
        }
      } catch(e) {
        console.error('Animation error:', e)
      }

      return () => {
        if(mixer) mixer.stopAllAction()
      }
    }, [actions, names, mixer])

    return (
      <primitive 
        ref={group} 
        object={scene} 
        scale={[10,10,10]}
        position={[0, 0, 0]}
        onClick={handleClick}
      />
    )
}

export { WhiteSharkModel }
