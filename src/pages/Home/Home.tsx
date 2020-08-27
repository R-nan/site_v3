import gsap from 'gsap';
import React, { createRef, RefObject, useEffect, useState, useRef, useCallback } from 'react';
import { StyledHome } from './styled';
import CanvasElement from '../../components/CanvasElement';
import CanvasManager from '../../canvasComponents/CanvasManager/CanvasManager';
import FontRenderer from '../../canvasComponents/FontRenderer/FontRenderer';
import * as Italiana from '../../assets/fonts/italiana.js';
import BoidsManager from '../../canvasComponents/BoidsManager/BoidsManager';
import ShapeType from '../../canvasComponents/BoidsManager/ShapeType';
import BoidStates from '../../canvasComponents/BoidsManager/BoidStates';
import { useResize } from '../../hooks/useResize';
import Vector from '../../utils/Vector';
import { randomVectorsPositions } from '../../utils/random';

export const Home = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  const [canvas, setCanvas] = useState<CanvasManager | null>(null);
  const fontRendererRef = useRef<any | null>(null);
  const boidsRef = useRef<any | null>(null);
  const introBoidsRef = useRef<any | null>(null);
  const mainLoop: GSAPTimeline = gsap.timeline({repeat: -1, paused: true, repeatDelay: 8});

  const setupMainLoop = (boids: BoidsManager, fontRenderer: FontRenderer) => {
    mainLoop
    .call(() => {
      fontRenderer.changeColor({r:255, g:255, b:255, a:1})
      boids.unfold();
    }, [],2)
    .call(() => boids.release(), [], '+=3')
    .call(() => {
      boids.roost().then(() => {
        boids.fold();
        fontRenderer.changeColor({r: 0, g: 0, b:0, a: 1});
      })
    }, [], '+=6');
  };

  useEffect(() => {
    const CanvasComponent = new CanvasManager(canvasRef.current as HTMLCanvasElement)
    setCanvas(CanvasComponent);

    return () => {
      CanvasComponent.dispose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(canvas) {
      const fontRenderer = new FontRenderer(canvas, {
        text: 'Anthony Lui',
        font: Italiana,
        align: 'center'
      })
      canvas.init();
      fontRenderer.init();
      fontRenderer.addToCanvas();
      
      fontRenderer.getFontVectors().then((fontVectors) => {
        const boids = new BoidsManager(canvas, {
          count: 200,
          initialPositions: fontVectors(),
          boidShape: ShapeType.KITE(),
          boidState: BoidStates.REST,
          color: {r: 0, g: 0, b: 0, a: 1}
        })

        boids.init();
        fontRendererRef.current = fontRenderer;
        boidsRef.current = boids;

        setupMainLoop(boidsRef.current, fontRendererRef.current)
        setupIntro();
      });
    }
  }, [canvas]);

  const endIntro = useCallback(() => {
    canvas?.changeColor({r: 255, g: 255, b: 255, a: 1}).then(() => {
      introBoidsRef.current.fold();
      mainLoop.play();
    });
    introBoidsRef.current.changeColor({r: 0, g: 0, b: 0, a: 1});
  }, [canvas, mainLoop])

  const playIntro = useCallback(() => {
    introBoidsRef.current.flySequence().then(endIntro);
  }, [endIntro])

  useResize(() => {
    if (canvas && boidsRef && fontRendererRef) {
      canvas.resize();
      fontRendererRef.current.init();
      fontRendererRef.current.getFontVectors().then((fontVectors: any) => {
        boidsRef.current.onResize(fontVectors());
      })
    }
  });

  const handleClick = useCallback(() => {
    // fontRendererRef.current.changeColor({r: 40, g: 100, b:2})
    // console.log(fontRendererRef.current)
    boidsRef.current.release();
  }, []);

  const handleOnRelease = useCallback(() => {
    boidsRef.current.release();
  }, []);

  const handleOnRest = useCallback(() => {
    boidsRef.current.rest();
  }, []);

  const handleOnRoost = useCallback(() => {
    boidsRef.current.roost();
  }, []);

  const handleOnUnfold = useCallback(() => {
    boidsRef.current.unfold();
  }, []);

  const handleOnFold = useCallback(() => {
    boidsRef.current.fold();
  }, []);

  const setupIntro = useCallback(() => {
    if (!canvas) return;

    const glyph_I = fontRendererRef.current.glyphs['105']
    const finalDestination = glyph_I[glyph_I.length - 3]
    const randomSequence = randomVectorsPositions(canvas.canvas.width, canvas.canvas.height, 1);
    const randomVector: any = new Vector((Math.random() * canvas.canvas.width), (Math.random() * canvas.canvas.height));
    introBoidsRef.current = new BoidsManager(canvas, {
      count:1,
      initialPositions: [randomVector],
      boidShape: ShapeType.KITE(),
      boidState: BoidStates.REST,
      target: new Vector(0, 0),
      sequence: [...randomSequence, finalDestination],
      color: {r: 255, g: 255, b: 255, a: 1}
    })
    introBoidsRef.current.init();
    introBoidsRef.current.unfold();

    setTimeout(() => {
      playIntro();
    }, 4000)

  }, [canvas, playIntro])

  return (
    <StyledHome>
      {/* <button onClick={handleOnRest}>Rest</button> */}
      {/* <button onClick={handleOnRelease}>Release</button> */}
      {/* <button onClick={handleOnRoost}>Roost</button> */}
      {/* <button onClick={handleOnUnfold}>Unfold</button> */}
      {/* <button onClick={handleOnFold}>Fold</button> */}

      <CanvasElement ref={canvasRef} id={'boids'}/>
    </StyledHome>
  )
};