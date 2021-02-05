import gsap from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
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
import { useMouseMove } from '../../hooks/useMouseMove';
import Vector from '../../utils/Vector';
import IColor from '../../interface/IColor';
import { ReactComponent as IconMail } from '../../assets/svg/mail.svg';
import { ReactComponent as IconGithub } from '../../assets/svg/github.svg';
import { ReactComponent as IconLinkedIn } from '../../assets/svg/linkedin.svg';
import BoidPath from '../../canvasComponents/BoidsManager/BoidPath';
import { SignatureDesktop, SignatureMobile } from '../../data/Signature';
import centerRawPath from '../../utils/centerRawPath';

export const colorOffWhite: IColor = {r: 255, g: 242, b: 227, a: 1};
export const colorBlack: IColor = {r: 42, g: 59, b: 61, a: 1};
export const colorRed: IColor = {r: 220, g: 20, b: 60, a: 1};

export const Home = () => {
  gsap.registerPlugin(MotionPathPlugin);

  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  const [enableMouse, setEnableMouse] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<CanvasManager | null>(null);
  const fontRendererRef = useRef<any | null>(null);
  const boidsRef = useRef<any | null>(null);
  const introBoidsRef = useRef<any | null>(null);
  const mainLoop: GSAPTimeline = gsap.timeline({repeat: -1, paused: true, repeatDelay: 8});
  const boidColor: IColor = colorRed;
  const buttonContainerRef = useRef<any | null>(null);
  const setupMainLoop = useCallback((boids: BoidsManager, fontRenderer: FontRenderer) => {
    mainLoop
    .call(() => {
      fontRenderer.changeColor(colorOffWhite)
      boids.unfold();
    }, [],2)
    .call(() => boids.release(), [], '+=3')
    .call(() => {
      boids.roost().then(() => {
        boids.fold();
        fontRenderer.changeColor(colorBlack);
      })
    }, [], '+=10');
  }, [mainLoop]);

  const changeButtonColor = useCallback(() => {
    const buttonContainerElement = buttonContainerRef.current;
    gsap.to(buttonContainerElement, {opacity: 1, duration: 2, delay: 0.5, ease: 'power.in'})
  }, [])

  const endIntro = useCallback(() => {
    canvas?.changeColor(colorOffWhite).then(() => {
      introBoidsRef.current.playingSequence = false;
      setEnableMouse(true);
      introBoidsRef.current.options.trailColor = {...colorBlack};
      changeButtonColor()
      mainLoop.play();
    });
    introBoidsRef.current.changeColor(colorBlack);
  }, [canvas, changeButtonColor, mainLoop])


  const setupIntro = useCallback(() => {
    if (!canvas) return;

    const glyph_I = fontRendererRef.current.glyphs['105']
    const finalDestination = glyph_I[glyph_I.length - 3]
    const rawPathSignatureSequence = MotionPathPlugin.stringToRawPath(canvas.canvas.width < 768 ? SignatureMobile : SignatureDesktop);
    const endVectors = [new Vector(finalDestination.x - 10, finalDestination.y + 50), new Vector(finalDestination.x, finalDestination.y + 50), finalDestination];
    const rawPathEndVectors = MotionPathPlugin.arrayToRawPath(endVectors);
    const centeredPath = centerRawPath(rawPathSignatureSequence, canvas.canvas.width, canvas.canvas.height, .6);

    introBoidsRef.current = new BoidPath(
      canvas,
      {
        target: new Vector(finalDestination.x, finalDestination.y),
        position: new Vector(centeredPath[0][0], centeredPath[0][1]),
        velocity: new Vector(0, 1),
        acceleration: new Vector(),
        maxSpeed: 15,
        maxForce: 0.2,
        size: canvas.canvas.width / 250,
        shape: ShapeType.KITE(),
        sequence: [...centeredPath, ...rawPathEndVectors],
        color: {...boidColor},
        angle: (Math.PI/180) * 243,
        trailColor: colorOffWhite,
      }
    )

    introBoidsRef.current.addToCanvas(2);

    introBoidsRef.current.unfold();

    setTimeout(() => {
      introBoidsRef.current.playSequence().then(endIntro)
    }, 2500)

  }, [boidColor, canvas, endIntro])

  useEffect(() => {
    const CanvasComponent = new CanvasManager(canvasRef.current as HTMLCanvasElement);
    CanvasComponent.options.backgroundColor = {...colorBlack};
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
        align: 'center',
        color: {...colorBlack},
      })
      canvas.init();
      fontRenderer.init();
      fontRenderer.addToCanvas();
      
      fontRenderer.getFontVectors().then((fontVectors) => {
        fontRendererRef.current = fontRenderer;
        fontVectors();
        setupIntro();
        const boids = new BoidsManager(canvas, {
          count: 200,
          size: canvas.canvas.width / 400,
          initialPositions: fontVectors(),
          boidShape: ShapeType.KITE(),
          boidState: BoidStates.REST,
          color: {...boidColor},
          showTrail: true,
          predators: [introBoidsRef.current]
        })

        boids.init();
        boidsRef.current = boids;

        boids.addToCanvas(0);
        
        setupMainLoop(boidsRef.current, fontRendererRef.current)
        // mainLoop.play();
      });

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  useResize(() => {
    if (canvas && boidsRef && fontRendererRef) {
      canvas.resize();
      fontRendererRef.current.init();
      fontRendererRef.current.getFontVectors().then((fontVectors: any) => {
        boidsRef.current.onResize(fontVectors());
      })
    }
  });

  useMouseMove(canvasRef, (event) => {
    const { target } = introBoidsRef.current.options;

    if(enableMouse) {
      target.x = event.x;
      target.y = event.y
    }

  })

  // const handleClick = useCallback(() => {
  //   boidsRef.current.release();
  // }, []);

  // const handleOnRelease = useCallback(() => {
  //   boidsRef.current.release();
  // }, []);

  // const handleOnRest = useCallback(() => {
  //   boidsRef.current.rest();
  // }, []);

  // const handleOnRoost = useCallback(() => {
  //   boidsRef.current.roost();
  // }, []);

  // const handleOnUnfold = useCallback(() => {
  //   boidsRef.current.unfold();
  // }, []);

  // const handleOnFold = useCallback(() => {
  //   boidsRef.current.fold();
  // }, []);

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