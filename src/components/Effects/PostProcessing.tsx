/**
 * Post-Processing Effects Component
 * Adds bloom, ambient occlusion, and other visual effects
 */

import React from 'react'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  ToneMapping,
  SMAA,
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import { Vector2 } from 'three'

interface PostProcessingProps {
  enableBloom?: boolean
  enableVignette?: boolean
  enableChromaticAberration?: boolean
  bloomIntensity?: number
  nightMode?: boolean
}

const PostProcessing: React.FC<PostProcessingProps> = ({
  enableBloom = true,
  enableVignette = true,
  enableChromaticAberration = false,
  bloomIntensity = 0.5,
  nightMode = false,
}) => {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {enableBloom ? (
        <Bloom
          intensity={nightMode ? bloomIntensity * 1.5 : bloomIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.8}
        />
      ) : (
        <></>
      )}
      {enableChromaticAberration ? (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.001, 0.001)}
          radialModulation={true}
          modulationOffset={0.5}
        />
      ) : (
        <></>
      )}
      {enableVignette ? (
        <Vignette
          offset={0.3}
          darkness={nightMode ? 0.7 : 0.4}
          blendFunction={BlendFunction.NORMAL}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}

export default PostProcessing
