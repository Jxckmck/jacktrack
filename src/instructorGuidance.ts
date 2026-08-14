export type InstructorMistakeResponse = {
  issue: string
  coachingResponse: string
}

export type InstructorGuidance = {
  teachingOrder: string[]
  suggestedWording: string[]
  demonstration: string[]
  promptLadder: {
    full: string
    short: string
    independent: string
  }
  mistakeResponses: InstructorMistakeResponse[]
  interveneIf: string[]
}

// These are coaching suggestions, not a rigid mandatory method.
// Adapt them to the learner, road, vehicle and conditions. Safety and the
// Highway Code always take priority.

export const instructorGuidance: Record<number, InstructorGuidance> = {
  1: {
    "teachingOrder": [
      "Start with whether the learner, supervisor and vehicle are legally ready for private practice.",
      "Cover licence, insurance, supervisor eligibility, roadworthiness, tax/MOT, L plates, eyesight and fitness to drive.",
      "Finish with scenarios where the correct decision is not to start or to stop the drive."
    ],
    "suggestedWording": [
      "Before we move, talk me through everything that has to be legal for this drive to happen.",
      "If one of those things was wrong, what would you do?",
      "I'll ask questions first so you get used to making the decision yourself."
    ],
    "demonstration": [
      "Walk around the real car and point out the L plates and obvious roadworthiness checks.",
      "Show where the learner would verify vehicle or insurance information rather than relying on assumption."
    ],
    "promptLadder": {
      "full": "Talk through each legal requirement and ask the learner to confirm it.",
      "short": "Ask: 'Are we legal and fit to drive?'",
      "independent": "Expect the learner to raise any reason the drive should not go ahead without prompting."
    },
    "mistakeResponses": [
      {
        "issue": "Assuming the owner’s insurance automatically covers the learner.",
        "coachingResponse": "Ask how they would prove they are insured before driving."
      },
      {
        "issue": "Treating tiredness, illness or medication as less important than alcohol.",
        "coachingResponse": "Use a scenario and ask how judgement or reaction time could be affected."
      }
    ],
    "interveneIf": [
      "Do not start if licence, insurance, vehicle legality or fitness to drive is in doubt.",
      "Do not use a motorway in ordinary private practice; learner motorway driving requires an ADI in a dual-control car."
    ]
  },
  2: {
    "teachingOrder": [
      "Begin with a practical walk-around: tyres, lights, windows, mirrors and number plates.",
      "Move to fluids, warning lights, steering and brakes using the real vehicle where possible.",
      "Ask the learner to decide which faults need monitoring and which mean the car should not be driven."
    ],
    "suggestedWording": [
      "Don't just give me a memorised answer — show me what you'd actually check.",
      "What would make you stop and not drive this car?",
      "If that warning appeared after we set off, what would your safe plan be?"
    ],
    "demonstration": [
      "Demonstrate one full walk-around while explaining what each check is trying to establish.",
      "Show how to find tyre-pressure information and the meaning of key warning lights for the car."
    ],
    "promptLadder": {
      "full": "Guide the learner around the car one check at a time.",
      "short": "Ask: 'Is the car safe and ready?'",
      "independent": "Let the learner complete the whole check, then discuss anything missed."
    },
    "mistakeResponses": [
      {
        "issue": "Looking at tyres without considering tread, pressure and damage separately.",
        "coachingResponse": "Ask for the three things they are trying to establish about each tyre."
      },
      {
        "issue": "Ignoring an unfamiliar warning light because the car still moves normally.",
        "coachingResponse": "Ask what information they would check before deciding it is safe to continue."
      }
    ],
    "interveneIf": [
      "Do not drive if a defect could make the car unsafe or illegal.",
      "Prevent unsafe checking around hot or moving engine components."
    ]
  },
  3: {
    "teachingOrder": [
      "Teach a consistent cockpit sequence: doors, seat, head restraint, steering position, seat belt and mirrors.",
      "Explain why the seat must be set before the mirrors.",
      "For an automatic, confirm the parking brake and P or N before starting, following the vehicle’s instructions."
    ],
    "suggestedWording": [
      "Set the car up as though I wasn't here.",
      "Can you use the brake fully without stretching or lifting yourself out of the seat?",
      "What would you need to redo if someone else had driven the car?"
    ],
    "demonstration": [
      "Show a comfortable seat and steering position that allows full control.",
      "Show the useful view in each mirror and point out the remaining blind spots."
    ],
    "promptLadder": {
      "full": "Name each cockpit check in order.",
      "short": "Say only: 'Set yourself up.'",
      "independent": "Expect the learner to notice and correct anything altered by another driver."
    },
    "mistakeResponses": [
      {
        "issue": "Adjusting mirrors before the seat.",
        "coachingResponse": "Ask which adjustment changes the position of their eyes and therefore the mirror view."
      },
      {
        "issue": "Starting before checking the selector and parking brake.",
        "coachingResponse": "Reset and repeat the start routine rather than letting the rushed sequence become habit."
      }
    ],
    "interveneIf": [
      "Do not move until the learner can operate the controls fully and see adequately.",
      "Remove or secure loose items that could interfere with the controls."
    ]
  },
  4: {
    "teachingOrder": [
      "Choose a safe and legal place to finish the drive.",
      "Secure the vehicle correctly, switch off, take the keys where applicable and lock it.",
      "Teach mirror and blind-spot checks before opening a door, then discuss personal and vehicle security."
    ],
    "suggestedWording": [
      "We've finished. Secure the car as if I wasn't here.",
      "Before you open your door, who could be coming alongside us?",
      "Would you be happy leaving the car here at night? Why?"
    ],
    "demonstration": [
      "Show a safe exit check before opening the door.",
      "Demonstrate the vehicle’s automatic-car shutdown sequence, including selecting P and securing the parking brake."
    ],
    "promptLadder": {
      "full": "Talk through the shutdown and exit checks step by step.",
      "short": "Ask: 'Is the car secure and is it safe to get out?'",
      "independent": "Make the end-of-drive security routine learner-led."
    },
    "mistakeResponses": [
      {
        "issue": "Opening the door immediately after stopping.",
        "coachingResponse": "Prompt a mirror and blind-spot check before the door moves."
      },
      {
        "issue": "Walking away without checking that the vehicle locked.",
        "coachingResponse": "Ask how they can confirm it is secure."
      }
    ],
    "interveneIf": [
      "Prevent a door opening into the path of a cyclist, pedestrian or vehicle.",
      "Do not leave children or animals in unsafe conditions."
    ]
  },
  5: {
    "teachingOrder": [
      "Identify the essential controls while stationary.",
      "Practise smooth accelerator, brake and steering inputs on a quiet road.",
      "Add secondary controls such as indicators, lights, wipers and demisters only when basic control is stable."
    ],
    "suggestedWording": [
      "Show me the control I name without looking for longer than you need to.",
      "Build the brake pressure smoothly rather than stabbing at the pedal.",
      "The assistance system can help, but who is still responsible for the decision?"
    ],
    "demonstration": [
      "While stationary, demonstrate each essential control and the feedback it gives.",
      "On a quiet road, demonstrate one smooth acceleration and progressive stop while narrating the pedal pressure."
    ],
    "promptLadder": {
      "full": "Name the control and how to use it.",
      "short": "Describe the need, for example: 'The screen is misting.'",
      "independent": "Expect the learner to choose the correct control while maintaining road awareness."
    },
    "mistakeResponses": [
      {
        "issue": "Using the left foot on the brake in an automatic.",
        "coachingResponse": "Stop safely, reset foot position and keep the left foot resting away from the pedals."
      },
      {
        "issue": "Looking down for controls for too long.",
        "coachingResponse": "Practise finding them while stationary until the movement becomes familiar."
      }
    ],
    "interveneIf": [
      "Intervene if pedal confusion, selector misuse or loss of steering control creates risk.",
      "Do not let a secondary-control task distract from an emerging hazard."
    ]
  },
  6: {
    "teachingOrder": [
      "Teach preparation, effective observation and the final decision before the car moves.",
      "Teach mirrors, safe stopping-place choice, smooth slowing and securing the car after stopping.",
      "Progress from level quiet roads to gradients, angled starts and moving from behind parked vehicles."
    ],
    "suggestedWording": [
      "Prepare first. Before the car moves, prove to yourself the space is safe.",
      "What changed during your final observation?",
      "Pick a safe place to stop — don't just stop because I asked."
    ],
    "demonstration": [
      "Demonstrate one move-away while narrating preparation, observations and the final decision.",
      "Demonstrate a smooth stop including mirrors before reducing speed and securing the vehicle afterwards."
    ],
    "promptLadder": {
      "full": "Use step-by-step prompts: prepare, observe, decide, move.",
      "short": "Say: 'Move away when it's safe' or 'Find a safe place to stop.'",
      "independent": "Give only the route instruction and let the learner manage the whole routine."
    },
    "mistakeResponses": [
      {
        "issue": "Moving after an old blind-spot check.",
        "coachingResponse": "Ask for a final check immediately before movement because the scene may have changed."
      },
      {
        "issue": "Signalling automatically when nobody benefits.",
        "coachingResponse": "Ask: 'Who is the signal for?' before it becomes habit."
      }
    ],
    "interveneIf": [
      "Stop the move-away if a road user enters the danger area or the learner has not seen them.",
      "Intervene if the stopping position or speed creates immediate danger."
    ]
  },
  7: {
    "teachingOrder": [
      "Establish a safe normal driving position and adequate clearance from hazards.",
      "Teach how speed, road width and other road users change the space needed.",
      "Add lane choice and early positioning for turns once basic road position is stable."
    ],
    "suggestedWording": [
      "Where is the safest space for the car here?",
      "What could come out from beside that parked vehicle?",
      "If that gap gets tighter, at what point would you wait?"
    ],
    "demonstration": [
      "Demonstrate normal positioning and extra clearance around a parked vehicle while adjusting speed.",
      "Show how early lane choice avoids last-second steering."
    ],
    "promptLadder": {
      "full": "Describe the desired position and why.",
      "short": "Ask: 'Where is your safe space?'",
      "independent": "Let the learner decide position and when to wait at narrowings."
    },
    "mistakeResponses": [
      {
        "issue": "Driving too close to parked vehicles.",
        "coachingResponse": "Ask what door or pedestrian risk exists and reduce speed before increasing clearance."
      },
      {
        "issue": "Forcing through a narrow gap because the car physically fits.",
        "coachingResponse": "Ask whether there is still a safety margin if someone moves unexpectedly."
      }
    ],
    "interveneIf": [
      "Intervene before the learner enters a gap that cannot be negotiated safely.",
      "Correct position promptly if the vehicle is at risk of striking a kerb, obstruction or road user."
    ]
  },
  8: {
    "teachingOrder": [
      "Identify what each mirror shows and where the blind spots remain.",
      "Use mirrors before relevant changes of speed, direction or position.",
      "Make the learner explain what they saw and how it changes the plan."
    ],
    "suggestedWording": [
      "Which mirror gives you the information you need for this action?",
      "What did you actually see?",
      "Does what you saw change your plan?"
    ],
    "demonstration": [
      "While stationary, show the coverage of each mirror and the blind spots.",
      "During a safe demonstration, narrate a mirror check and a decision it causes, such as delaying a lane change."
    ],
    "promptLadder": {
      "full": "Prompt the correct mirror before each simple action.",
      "short": "Ask: 'What's behind or alongside?'",
      "independent": "Expect timely mirror checks and rechecks without prompting."
    },
    "mistakeResponses": [
      {
        "issue": "Checking after the manoeuvre has already begun.",
        "coachingResponse": "Reset the sequence so information is gathered before the decision."
      },
      {
        "issue": "Moving the head without processing the view.",
        "coachingResponse": "Ask the learner to tell you one useful fact they saw."
      }
    ],
    "interveneIf": [
      "Prevent a change of speed, direction or position if the learner has missed a road user who would be affected.",
      "Prompt attention back ahead if mirror fixation creates a forward hazard."
    ]
  },
  9: {
    "teachingOrder": [
      "Teach mirrors before the signal decision.",
      "Teach that signals should be useful, correctly timed and not misleading.",
      "Teach the learner to treat other road users’ signals as information rather than a guarantee."
    ],
    "suggestedWording": [
      "Who would benefit from a signal here?",
      "If you signal now, could anyone misunderstand you?",
      "What evidence do you have that the other driver will actually turn?"
    ],
    "demonstration": [
      "Demonstrate a well-timed signal and explain why an earlier or later signal could be misleading.",
      "Point out brake, reversing and hazard lights when they are naturally encountered."
    ],
    "promptLadder": {
      "full": "Prompt mirrors, then ask whether a signal is needed and when.",
      "short": "Ask: 'Do we need to communicate anything?'",
      "independent": "Expect the learner to decide whether, when and how to signal."
    },
    "mistakeResponses": [
      {
        "issue": "Signalling before checking mirrors.",
        "coachingResponse": "Reset to information first, communication second."
      },
      {
        "issue": "Trusting another vehicle’s indicator.",
        "coachingResponse": "Ask for supporting evidence from its speed, position and movement."
      }
    ],
    "interveneIf": [
      "Intervene if a misleading signal is likely to cause another road user to act unsafely.",
      "Do not allow signalling to substitute for observation or giving way."
    ]
  },
  10: {
    "teachingOrder": [
      "Teach scanning well ahead and toward places where hazards could emerge.",
      "Link a clue to a prediction, then turn that prediction into an early speed, position or space change.",
      "Teach the learner to update or abandon the plan when new information appears."
    ],
    "suggestedWording": [
      "Tell me the clue first, then what you think could happen.",
      "What can you change now so it never becomes an emergency?",
      "If your first plan stops working, what's your safe alternative?"
    ],
    "demonstration": [
      "Give a short commentary demonstration using clue → possible hazard → action.",
      "Show how easing off early creates time and options even if the hazard does not develop."
    ],
    "promptLadder": {
      "full": "Ask for one clue, one possible hazard and one planned action.",
      "short": "Ask: 'What could happen next?'",
      "independent": "Expect early changes of speed, position or space before you need to prompt."
    },
    "mistakeResponses": [
      {
        "issue": "Naming hazards without changing the plan.",
        "coachingResponse": "Follow with: 'So what are you doing about it?'"
      },
      {
        "issue": "Trying to comment on everything and losing control.",
        "coachingResponse": "Reduce the task to the single most important developing risk."
      }
    ],
    "interveneIf": [
      "Intervene if a predictable hazard is becoming urgent and the learner has not begun a safe response.",
      "Reduce commentary immediately if it distracts from vehicle control."
    ]
  },
  11: {
    "teachingOrder": [
      "Teach the difference between the legal limit and a safe speed for current conditions.",
      "Use visibility, road layout, pedestrians, weather and traffic to choose speed.",
      "Teach early accelerator release and progressive braking so speed is set before the hazard."
    ],
    "suggestedWording": [
      "What is the limit, and what tells you?",
      "Forget the limit for a moment — is this speed safe for what you can see?",
      "Could you have made that speed change earlier and more smoothly?"
    ],
    "demonstration": [
      "Demonstrate reading limit clues and setting speed before a bend or hazard.",
      "Show smooth accelerator release and progressive braking on a suitable approach."
    ],
    "promptLadder": {
      "full": "Identify the limit, the hazard and the suitable approach speed together.",
      "short": "Ask: 'Does this speed fit what you can see?'",
      "independent": "Expect the learner to choose and adjust speed without prompting."
    },
    "mistakeResponses": [
      {
        "issue": "Treating the speed limit as a target.",
        "coachingResponse": "Ask what current risk makes a lower speed appropriate."
      },
      {
        "issue": "Late heavy braking.",
        "coachingResponse": "Move the learner’s observation further ahead and coach earlier accelerator release."
      }
    ],
    "interveneIf": [
      "Intervene before speed becomes unsafe for the visible hazard or legal limit.",
      "Do not push for progress when the learner’s observation or control cannot support it."
    ]
  },
  12: {
    "teachingOrder": [
      "Start with meeting and giving-way situations around parked vehicles or narrowings.",
      "Teach the space needs and blind spots of large and vulnerable road users.",
      "Only introduce overtaking when the learner can judge view, space, speed and legality reliably."
    ],
    "suggestedWording": [
      "Who has priority, and does that automatically make it safe to continue?",
      "What space might that road user need unexpectedly?",
      "If you overtake now, will anyone have to change speed or direction because of you?"
    ],
    "demonstration": [
      "Demonstrate a meeting situation where early speed reduction creates room.",
      "Point out likely blind areas around a large vehicle and how to avoid sitting alongside it."
    ],
    "promptLadder": {
      "full": "Talk through priority, available space and the safest option.",
      "short": "Ask: 'Who should wait?' or 'Is there enough margin?'",
      "independent": "Let the learner decide whether to proceed, wait or abandon an overtake."
    },
    "mistakeResponses": [
      {
        "issue": "Competing for a narrow gap.",
        "coachingResponse": "Ask which safer choice costs only a few seconds."
      },
      {
        "issue": "Passing a vulnerable road user with too little space.",
        "coachingResponse": "Reduce speed and wait until adequate clearance is genuinely available."
      }
    ],
    "interveneIf": [
      "Intervene if the learner would force another road user to take avoiding action.",
      "Stop an overtake or pass if view, space or speed margin becomes inadequate."
    ]
  },
  13: {
    "teachingOrder": [
      "Teach the learner to look further ahead and avoid unnecessary acceleration toward a foreseeable stop.",
      "Develop smooth accelerator use and early easing-off while maintaining appropriate progress.",
      "Link efficient driving to maintenance, tyre pressures and vehicle condition."
    ],
    "suggestedWording": [
      "What can you see ahead that means you could ease off now?",
      "Why did we need that brake application — could earlier planning have reduced it?",
      "Would trying to save energy here reduce our safety margin?"
    ],
    "demonstration": [
      "Demonstrate approaching a red light or queue by easing off early rather than accelerating then braking.",
      "Show how steady accelerator inputs maintain progress smoothly."
    ],
    "promptLadder": {
      "full": "Point out upcoming situations where easing off early is useful.",
      "short": "Ask: 'Can you plan this with less pedal?'",
      "independent": "Review overall smoothness after the route rather than prompting each event."
    },
    "mistakeResponses": [
      {
        "issue": "Driving too slowly in the name of economy.",
        "coachingResponse": "Reinforce that efficient driving still includes safe and reasonable progress."
      },
      {
        "issue": "Repeated accelerator-brake switching.",
        "coachingResponse": "Move observation further ahead so decisions happen earlier."
      }
    ],
    "interveneIf": [
      "Intervene whenever an efficiency choice reduces safety, control or appropriate progress.",
      "Do not encourage techniques that conflict with the vehicle manufacturer’s guidance."
    ]
  },
  14: {
    "teachingOrder": [
      "Start with quiet open T-junctions and identify priority early.",
      "Teach mirrors, signal decision, position, speed and observation as a flexible routine.",
      "Progress to closed, busier, staggered and unmarked junctions only when simple junctions are stable."
    ],
    "suggestedWording": [
      "What type of junction is it and who has priority?",
      "What speed gives you time to look and stop?",
      "If you take that gap, will anyone with priority need to react?"
    ],
    "demonstration": [
      "Demonstrate an open junction where information is available early and a closed junction where the approach must be slower.",
      "Narrate the final observations and why a gap is accepted or rejected."
    ],
    "promptLadder": {
      "full": "Talk through mirrors, signal, position, speed and look.",
      "short": "Use a brief cue such as: 'Position, speed, look.'",
      "independent": "Give only the route direction and let the learner manage the junction."
    },
    "mistakeResponses": [
      {
        "issue": "Approaching too quickly to observe properly at the give-way line.",
        "coachingResponse": "Set the speed earlier so the learner arrives with thinking time."
      },
      {
        "issue": "Looking both ways but not turning the information into a decision.",
        "coachingResponse": "Ask: 'What does what you saw mean for us?'"
      }
    ],
    "interveneIf": [
      "Intervene before the learner enters a gap that would make priority traffic alter speed or direction.",
      "Slow or stop the vehicle if approach speed leaves insufficient time to observe."
    ]
  },
  15: {
    "teachingOrder": [
      "Plan the exit and lane from signs and road markings early.",
      "Control approach speed so the learner can make a calm give-way decision.",
      "Maintain lane discipline, effective observation and appropriate exit signalling."
    ],
    "suggestedWording": [
      "Which exit are we taking, and what lane or position supports that?",
      "What does the traffic from the right mean for your decision?",
      "Don't chase a gap — control the approach and let the safe gap come to you."
    ],
    "demonstration": [
      "Demonstrate one simple roundabout, narrating sign reading, lane choice, speed, gap decision and exit.",
      "Show how earlier speed reduction creates more decision time."
    ],
    "promptLadder": {
      "full": "Prompt exit, lane, approach speed, observation and signal in good time.",
      "short": "Ask: 'Exit, lane, gap?'",
      "independent": "Give only the destination or exit and let the learner manage the roundabout."
    },
    "mistakeResponses": [
      {
        "issue": "Approaching too quickly and then braking abruptly.",
        "coachingResponse": "Coach earlier accelerator release and braking."
      },
      {
        "issue": "Trying a late lane change after choosing the wrong lane.",
        "coachingResponse": "Teach the learner to continue safely in the current lane rather than force a correction."
      }
    ],
    "interveneIf": [
      "Intervene if the learner is about to enter an unsafe gap or leave their lane into another vehicle.",
      "Do not allow a late route correction to override lane discipline and safety."
    ]
  },
  16: {
    "teachingOrder": [
      "Teach the learner to identify the crossing type and scan both the crossing and its approaches.",
      "Check mirrors and set a speed that allows a smooth stop if someone may cross.",
      "Teach the correct stop position and a final safety check before moving again."
    ],
    "suggestedWording": [
      "What type of crossing is ahead?",
      "Who could reach it before we do?",
      "What speed means you could stop smoothly if that person steps out?"
    ],
    "demonstration": [
      "Demonstrate an early planned approach where the accelerator is released because a pedestrian may cross.",
      "Point out the road markings, lights or beacons and the correct stopping area."
    ],
    "promptLadder": {
      "full": "Name the crossing, identify likely users and choose an approach speed together.",
      "short": "Ask: 'Who might cross here?'",
      "independent": "Expect recognition and early speed adjustment without prompts."
    },
    "mistakeResponses": [
      {
        "issue": "Watching the traffic signal but not the people.",
        "coachingResponse": "Ask where pedestrians are coming from and whether anyone is hidden."
      },
      {
        "issue": "Moving as soon as the signal changes without rechecking.",
        "coachingResponse": "Prompt a final safety check of the crossing and immediate path."
      }
    ],
    "interveneIf": [
      "Brake or stop if a pedestrian is at risk and the learner has not responded in time.",
      "Prevent the vehicle from blocking the crossing or pressuring a pedestrian."
    ]
  },
  17: {
    "teachingOrder": [
      "Prepare and complete all-round observations before movement.",
      "Reverse at walking pace or slower while maintaining a continuous scan.",
      "Teach the path of both the rear and the front swing and the need to stop whenever the view becomes uncertain."
    ],
    "suggestedWording": [
      "Before the car moves, show me the whole area is safe.",
      "Keep it slow enough that you can stop the instant something changes.",
      "Where is the front of the car swinging while the rear goes that way?"
    ],
    "demonstration": [
      "Demonstrate a short straight reverse with deliberate all-round checks.",
      "Show how a reversing camera adds information but does not replace direct observation."
    ],
    "promptLadder": {
      "full": "Prompt each observation area and the slow-control technique.",
      "short": "Ask: 'All round — what's changing?'",
      "independent": "Give an end position and expect the learner to control speed, steering and observations."
    },
    "mistakeResponses": [
      {
        "issue": "Reversing too quickly.",
        "coachingResponse": "Use brake-controlled creep in the automatic and reset to a slower pace."
      },
      {
        "issue": "Fixating on one mirror or the camera.",
        "coachingResponse": "Stop and rebuild the all-round scan before moving again."
      }
    ],
    "interveneIf": [
      "Stop immediately if a pedestrian, cyclist or vehicle enters the risk area and the learner has not responded.",
      "Intervene before contact with kerbs, vehicles or fixed objects."
    ]
  },
  18: {
    "teachingOrder": [
      "First decide whether turning here is safe and sensible or whether another method would be better.",
      "Plan slow forward and reverse movements, stopping fully before changing direction.",
      "Maintain all-round observation throughout and give way whenever another road user is affected."
    ],
    "suggestedWording": [
      "First question: should we turn here at all?",
      "Before changing direction, stop the car completely and reset your observations.",
      "If another road user arrives, forget finishing the manoeuvre and deal with them first."
    ],
    "demonstration": [
      "Demonstrate one controlled forward/reverse change, highlighting front and rear swing.",
      "Show how pausing creates time for observation and steering."
    ],
    "promptLadder": {
      "full": "Guide one movement at a time and ask for observations before each.",
      "short": "Ask: 'Next move — and who could be affected?'",
      "independent": "Give only the goal of turning around safely and let the learner choose the method/location."
    },
    "mistakeResponses": [
      {
        "issue": "Choosing a location because it is convenient rather than safe.",
        "coachingResponse": "Ask what sight lines, bends or junctions make the location suitable or unsuitable."
      },
      {
        "issue": "Changing between D and R while still rolling.",
        "coachingResponse": "Require a full stop before selecting the opposite direction."
      }
    ],
    "interveneIf": [
      "Stop the manoeuvre if another road user is placed at risk.",
      "Intervene before the learner mounts a kerb or loses control of the vehicle path."
    ]
  },
  19: {
    "teachingOrder": [
      "Choose a legal, safe parking place and assess the space before manoeuvring.",
      "Use slow control and continuous all-round observation rather than relying on fixed reference points.",
      "Teach safe correction if the first attempt does not finish accurately."
    ],
    "suggestedWording": [
      "The goal is safe and accurate, not perfect in one movement.",
      "What is happening around the whole car, not just at your reference point?",
      "If the position is wrong, stop and tell me how you would correct it."
    ],
    "demonstration": [
      "Demonstrate one bay or parallel park while narrating observation, speed and vehicle path rather than memorised wheel turns.",
      "Show a safe correction so the learner sees that adjusting is acceptable."
    ],
    "promptLadder": {
      "full": "Guide the setup, observation and steering in small steps.",
      "short": "Ask: 'Slow, observe, where is the car going?'",
      "independent": "Give only the parking goal and let the learner choose setup and corrections."
    },
    "mistakeResponses": [
      {
        "issue": "Staring at a reference point and losing awareness.",
        "coachingResponse": "Stop and restore all-round observation before continuing."
      },
      {
        "issue": "Moving too quickly to make accurate corrections.",
        "coachingResponse": "Use brake-controlled creep so there is time to observe and adjust."
      }
    ],
    "interveneIf": [
      "Stop if a pedestrian or vehicle enters the manoeuvring area.",
      "Intervene before contact with another vehicle, kerb, wall or obstruction."
    ]
  },
  20: {
    "teachingOrder": [
      "Brief the exercise while stationary and agree the exact signal you will use.",
      "Teach an immediate firm brake application while keeping steering stable.",
      "After stopping, secure the car and complete effective observations before moving again."
    ],
    "suggestedWording": [
      "When I give the agreed signal, stop the car as quickly as you safely can while keeping it straight.",
      "Do not check the mirror before the emergency brake — the emergency itself is the priority.",
      "Once stopped, the exercise is not finished until the car is secure and you've checked before moving again."
    ],
    "demonstration": [
      "Explain pedal technique and possible ABS feedback while stationary.",
      "Only demonstrate the moving exercise where the road, traffic and conditions make it safe."
    ],
    "promptLadder": {
      "full": "Rebrief the signal, braking action and what happens after the stop.",
      "short": "Use only the agreed emergency-stop signal.",
      "independent": "Expect the learner to stop, secure the car and make all-round checks without extra prompts."
    },
    "mistakeResponses": [
      {
        "issue": "Braking too timidly.",
        "coachingResponse": "Rebrief firm progressive pressure and repeat only if conditions remain suitable."
      },
      {
        "issue": "Moving away immediately after the stop.",
        "coachingResponse": "Ask for full observations because the unusual stop may have changed surrounding traffic."
      }
    ],
    "interveneIf": [
      "Abandon the exercise if traffic, pedestrians, road surface or visibility make the location unsuitable.",
      "Take action if steering or braking control is being lost."
    ]
  },
  21: {
    "teachingOrder": [
      "Teach that the national speed limit is a maximum and that speed must be based on the visible road ahead.",
      "Read bends, brows, entrances, road width, surface and likely hidden hazards early.",
      "Teach safe positioning, meeting decisions and use of passing places without cutting bends."
    ],
    "suggestedWording": [
      "Can you stop in the distance you can actually see to be clear?",
      "What could be hidden beyond that bend or brow?",
      "If a vehicle appears now, where is your safe space?"
    ],
    "demonstration": [
      "Demonstrate early speed reduction before a blind bend and smooth acceleration only as the view opens.",
      "Show how position can improve the view without crossing the centre line or creating risk."
    ],
    "promptLadder": {
      "full": "Point out the bend or hidden area and ask for a speed and position plan.",
      "short": "Ask: 'What can you see, and can you stop in it?'",
      "independent": "Expect the learner to set speed and meeting plans from the available view."
    },
    "mistakeResponses": [
      {
        "issue": "Driving near the national speed limit because it is legally available.",
        "coachingResponse": "Ask what the current visible stopping distance actually supports."
      },
      {
        "issue": "Cutting a bend for a better line.",
        "coachingResponse": "Reinforce staying on the correct side and adjusting speed instead."
      }
    ],
    "interveneIf": [
      "Intervene if speed is unsafe for the distance visible to be clear.",
      "Prevent unsafe passing of cyclists, horse riders or pedestrians."
    ]
  },
  22: {
    "teachingOrder": [
      "Use the slip road to observe traffic, build an appropriate speed and plan a merge.",
      "Teach keep-left lane discipline, safe following distance and well-planned lane changes.",
      "Read signs early and prepare exits before they become rushed."
    ],
    "suggestedWording": [
      "Which gap are you planning to join, and does your speed match it?",
      "Why are we in this lane right now?",
      "Our exit is coming up — what can you do early so nothing becomes rushed?"
    ],
    "demonstration": [
      "Where appropriate, demonstrate a join with early mirror observation, matched speed and a planned gap.",
      "Narrate a safe lane change: information, decision, signal when useful and smooth movement."
    ],
    "promptLadder": {
      "full": "Talk through the first join well before the merge point.",
      "short": "Ask: 'Gap, speed, lane?'",
      "independent": "Give the destination and let the learner manage joins, lanes and exits."
    },
    "mistakeResponses": [
      {
        "issue": "Joining much slower than the main traffic without a reason.",
        "coachingResponse": "Coach earlier acceleration where conditions and the vehicle allow."
      },
      {
        "issue": "Remaining in an overtaking lane after the pass.",
        "coachingResponse": "Ask what purpose the current lane is serving and return left when safe."
      }
    ],
    "interveneIf": [
      "Intervene if a merge or lane change would force another road user to brake or swerve.",
      "Take action if following distance becomes unsafe at speed."
    ]
  },
  23: {
    "teachingOrder": [
      "Make the legal restriction explicit before any practical planning.",
      "Teach motorway knowledge: joining/leaving, lanes, spacing, signs, variable limits, red X, roadworks, fatigue and breakdown procedures.",
      "Use suitable dual carriageways for relevant private-practice preparation, leaving actual motorway tuition to an ADI in a dual-control car."
    ],
    "suggestedWording": [
      "Which motorway skills can we prepare for legally on a dual carriageway?",
      "What does a red X require you to do?",
      "If this were a motorway lesson, who would legally have to be supervising you?"
    ],
    "demonstration": [
      "In private practice, demonstrate motorway-relevant skills only on suitable non-motorway roads.",
      "Use diagrams or parked discussion for motorway lanes, signs and breakdown scenarios."
    ],
    "promptLadder": {
      "full": "Talk through motorway scenarios and the safe/legal response.",
      "short": "Ask: 'What would you do here on a motorway?'",
      "independent": "Expect the learner to explain motorway rules and decisions without prompts."
    },
    "mistakeResponses": [
      {
        "issue": "Assuming any experienced supervisor can accompany a learner on a motorway.",
        "coachingResponse": "Correct this immediately: learner motorway driving requires an ADI and a dual-control car."
      },
      {
        "issue": "Treating the middle or right lane as a normal cruising lane.",
        "coachingResponse": "Reinforce keeping left unless overtaking or road signs/markings require otherwise."
      }
    ],
    "interveneIf": [
      "Do not enter a motorway during ordinary private practice.",
      "Do not use high-speed preparation routes before the learner has sufficient observation, control and lane discipline."
    ]
  },
  24: {
    "teachingOrder": [
      "Check lights, windows and mirrors before setting off.",
      "Teach correct use of dipped/main beam and how to avoid dazzling others.",
      "Match speed to the reduced visible distance and increase anticipation for poorly lit road users and hazards."
    ],
    "suggestedWording": [
      "How far ahead can you genuinely see clearly?",
      "Does our speed let us deal with something at the edge of the headlight beam?",
      "Which lights are appropriate here, and who could they dazzle?"
    ],
    "demonstration": [
      "Show the lighting controls while stationary before the drive.",
      "Demonstrate looking toward the safe path rather than directly at oncoming glare."
    ],
    "promptLadder": {
      "full": "Prompt the light choice and ask what visibility means for speed.",
      "short": "Ask: 'Can you see enough for this speed?'",
      "independent": "Expect the learner to manage lighting and speed as visibility changes."
    },
    "mistakeResponses": [
      {
        "issue": "Driving at daytime speed despite shorter visibility.",
        "coachingResponse": "Ask what distance they can actually see and set speed from that."
      },
      {
        "issue": "Failing to dip main beam in time.",
        "coachingResponse": "Prompt before another road user is dazzled, then review the cue that should trigger the change."
      }
    ],
    "interveneIf": [
      "Intervene if speed is unsafe for the visible distance.",
      "Prompt or change lighting before another road user is dazzled if the learner has not responded."
    ]
  },
  25: {
    "teachingOrder": [
      "Assess whether the conditions are suitable for the learner before starting.",
      "Teach how rain, fog, ice, snow, wind and low sun change visibility, grip and stopping distance.",
      "Adjust speed, following distance, lights, wipers, demisters and control smoothness early."
    ],
    "suggestedWording": [
      "What has this weather changed: what you can see, the grip, or both?",
      "How much extra space do you want from the vehicle ahead?",
      "At what point would the safest decision be not to continue?"
    ],
    "demonstration": [
      "Demonstrate suitable use of wipers, demisters and a greater following gap.",
      "Show smooth pedal inputs in ordinary wet conditions without deliberately provoking loss of grip."
    ],
    "promptLadder": {
      "full": "Identify the weather risk and agree speed, spacing and visibility-control changes.",
      "short": "Ask: 'What's changed, and what are you changing?'",
      "independent": "Expect the learner to adapt without prompts as conditions change."
    },
    "mistakeResponses": [
      {
        "issue": "Keeping a dry-road following gap in reduced grip.",
        "coachingResponse": "Ask how the poorer grip changes stopping distance and available margin."
      },
      {
        "issue": "Continuing because the lesson was planned even when conditions worsen.",
        "coachingResponse": "Treat stopping, rerouting or cancelling as a positive safety decision."
      }
    ],
    "interveneIf": [
      "End or alter the drive if visibility, grip or weather severity is beyond the learner’s safe capability.",
      "Intervene before abrupt control inputs create a loss of grip or stability."
    ]
  },
  26: {
    "teachingOrder": [
      "Check seat belts/restraints, doors, animals and loose items before moving.",
      "Teach safe load placement, visibility and vehicle/tyre limits.",
      "Explain how extra weight and distracting passengers can change braking, acceleration, handling and decision-making."
    ],
    "suggestedWording": [
      "Before we move, is every person and item secure?",
      "What changes in the way the car may respond because of this load?",
      "If a passenger pressures you to hurry or take a risk, who makes the driving decision?"
    ],
    "demonstration": [
      "Show how a loose item could move into the footwell and then secure it correctly.",
      "Use the handbook or vehicle label to show where load or tyre-pressure information can be found if relevant."
    ],
    "promptLadder": {
      "full": "Run through occupants, restraints, loose items and visibility together.",
      "short": "Ask: 'Everyone and everything secure?'",
      "independent": "Make the passenger/load check learner-led and expect them to manage distraction."
    },
    "mistakeResponses": [
      {
        "issue": "Leaving small loose items unsecured.",
        "coachingResponse": "Ask where the item could go under hard braking."
      },
      {
        "issue": "Driving exactly the same despite a heavier load.",
        "coachingResponse": "Ask what extra margin may be needed for acceleration and stopping."
      }
    ],
    "interveneIf": [
      "Do not move until occupants, animals and loads are safely secured.",
      "Stop safely if passenger behaviour materially distracts or pressures the learner."
    ]
  },
  27: {
    "teachingOrder": [
      "Set the route and device before moving and begin on a familiar route.",
      "Teach the learner to translate directions into an early lane/position plan without staring at the screen.",
      "Make safe continuation the priority if a direction is missed or cannot be followed safely."
    ],
    "suggestedWording": [
      "What does the next instruction mean for your lane or position?",
      "If you cannot follow that direction safely, what is the correct choice?",
      "Missed the turn? Fine — keep driving safely and let the route recover."
    ],
    "demonstration": [
      "Demonstrate taking one navigation instruction, planning early and returning attention fully to the road.",
      "Explain how you would ignore or miss an instruction rather than make a late unsafe turn."
    ],
    "promptLadder": {
      "full": "Translate early directions together into lane and position decisions.",
      "short": "Ask: 'What does the next instruction mean for the car?'",
      "independent": "Give a destination and allow safe rerouting without translating directions for the learner."
    },
    "mistakeResponses": [
      {
        "issue": "Staring at the sat-nav screen.",
        "coachingResponse": "Coach listening and only brief safe glances, with primary attention on the road."
      },
      {
        "issue": "Making a late lane change to obey a direction.",
        "coachingResponse": "Tell the learner to continue safely in the current lane and reroute."
      }
    ],
    "interveneIf": [
      "Intervene if navigation is causing an unsafe lane change, turn or loss of observation.",
      "Require the vehicle to be safely parked before the learner manually changes the device or route."
    ]
  },
}
