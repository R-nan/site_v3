import gsap from 'gsap';
import React, { createRef, RefObject, useEffect, useState, useRef, useCallback } from 'react';
import { StyledHome, ButtonContainer, Link } from './styled';
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
import IColor from '../../interface/IColor';
import { ReactComponent as IconMail } from '../../assets/svg/mail.svg';
import { ReactComponent as IconGithub } from '../../assets/svg/github.svg';
import { ReactComponent as IconLinkedIn } from '../../assets/svg/linkedin.svg';



export const Home = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  const [canvas, setCanvas] = useState<CanvasManager | null>(null);
  const fontRendererRef = useRef<any | null>(null);
  const boidsRef = useRef<any | null>(null);
  const introBoidsRef = useRef<any | null>(null);
  const mainLoop: GSAPTimeline = gsap.timeline({repeat: -1, paused: true, repeatDelay: 8});
  const boidColor: IColor = {r: 220, g: 20, b: 60, a: 1};
  const buttonContainerRef = useRef<any | null>(null);
  const setupMainLoop = useCallback((boids: BoidsManager, fontRenderer: FontRenderer) => {
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
  }, [mainLoop]);

  const changeButtonColor = useCallback(() => {
    const buttonContainerElement = buttonContainerRef.current;
    gsap.to(buttonContainerElement, {opacity: 1, duration: 2, delay: 0.5, ease: 'power.in'})
  }, [])

  const endIntro = useCallback(() => {
    canvas?.changeColor({r: 255, g: 255, b: 255, a: 1}).then(() => {
      introBoidsRef.current.fold();
      changeButtonColor()
      mainLoop.play();
    });
    // introBoidsRef.current.changeColor({r: 0, g: 0, b: 0, a: 1});
  }, [canvas, changeButtonColor, mainLoop])

  const playIntro = useCallback(() => {
    introBoidsRef.current.flySequence().then(endIntro);
  }, [endIntro])

  const setupIntro = useCallback(() => {
    if (!canvas) return;

    const glyph_I = fontRendererRef.current.glyphs['105']
    const finalDestination = glyph_I[glyph_I.length - 3]
    const randomSequence = randomVectorsPositions(canvas.canvas.width, canvas.canvas.height, 1);
    const randomVector: any = new Vector((Math.random() * canvas.canvas.width), (Math.random() * canvas.canvas.height));
    introBoidsRef.current = new BoidsManager(canvas, {
      count:1,
      initialPositions: [randomVector],
      size: canvas.canvas.width / 250,
      boidShape: ShapeType.KITE(),
      boidState: BoidStates.REST,
      target: new Vector(0, 0),
      sequence: [...randomSequence, new Vector(finalDestination.x, finalDestination.y + 200), finalDestination],
      color: {...boidColor}
    })
    introBoidsRef.current.init();
    introBoidsRef.current.unfold();

    setTimeout(() => {
      playIntro();
    }, 4000)

  }, [boidColor, canvas, playIntro])

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
          count: 100,
          size: canvas.canvas.width / 250,
          initialPositions: fontVectors(),
          boidShape: ShapeType.KITE(),
          boidState: BoidStates.REST,
          color: {...boidColor}
        })

        boids.init();
        fontRendererRef.current = fontRenderer;
        boidsRef.current = boids;

        setupMainLoop(boidsRef.current, fontRendererRef.current)
        setupIntro();
      });
    }
  }, [boidColor, canvas, setupIntro, setupMainLoop]);

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

  return (
    <StyledHome>
      <CanvasElement ref={canvasRef} id={'boids'}/>
      <ButtonContainer ref={buttonContainerRef}>
        <Link href="https://github.com/R-nan" target="_blank">
         <IconGithub />
        </Link>
        <Link href="https://www.linkedin.com/in/anthonylui/" target="_blank">
          <IconLinkedIn />
        </Link>
        <Link href="mailto:anthony.r.lui@gmail.com" target="_blank">
          <IconMail/>
        </Link>
      </ButtonContainer>
    </StyledHome>
  )
};