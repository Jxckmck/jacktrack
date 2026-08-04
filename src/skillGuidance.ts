export type SkillGuidance = {
  summary: string
  covering: string[]
  practiceIdeas: string[]
  learnerQuestions: string[]
  watchOuts: string[]
  readyWhen: string[]
  automaticTip?: string
}

export const skillGuidance: Record<
  number,
  SkillGuidance
> = {
  1: {
    summary:
      'Understand the legal responsibilities that apply before and while driving, including the learner, supervisor and vehicle requirements.',
    covering: [
      'The learner must hold the correct provisional driving licence.',
      'The learner must be properly insured to drive the practice car.',
      'The supervising driver must meet the legal age and licence requirements.',
      'The car must be roadworthy, taxed and covered by a valid MOT when one is required.',
      'Legal L plates must be displayed clearly at the front and rear.',
      'The learner must meet the legal eyesight standard.',
      'Mobile phone, alcohol, drug, medication and seat-belt rules apply during practice.',
      'Private motorway practice is only allowed with an approved driving instructor in a dual-control car.',
    ],
    practiceIdeas: [
      'Before the first drive, ask the learner to explain what documents and insurance are required.',
      'Walk around the car together and check its L plates, tyres, lights and general condition.',
      'Ask the learner to identify situations where a planned drive should be cancelled.',
      'Discuss who is legally responsible when the learner is controlling the car.',
    ],
    learnerQuestions: [
      'What must be in place before you are legally allowed to practise?',
      'What would make this car unsuitable or illegal to drive today?',
      'What could affect whether you are fit to drive?',
      'When is a learner driver allowed to use a motorway?',
    ],
    watchOuts: [
      'Do not assume insurance automatically covers a learner.',
      'Check that the supervisor is legally eligible.',
      'Do not begin practice when either person is tired, distracted, unwell or impaired.',
      'Do not treat private practice as less serious than a formal lesson.',
    ],
    readyWhen: [
      'The learner can explain the main legal requirements without prompting.',
      'They check that the learner, supervisor and vehicle are legally ready before driving.',
      'They recognise situations where the drive should not go ahead.',
      'They understand that legal responsibility remains with the person driving.',
    ],
  },

  2: {
    summary:
      'Check that the vehicle is safe and roadworthy before setting off, and recognise warning signs that require action.',
    covering: [
      'Tyres have suitable tread, pressure and no obvious damage.',
      'Lights, indicators and reflectors are clean and working.',
      'Windows, mirrors and number plates are clean and unobstructed.',
      'Fluid levels are sufficient, including screen wash where appropriate.',
      'Brakes and steering appear to operate normally.',
      'Doors, bonnet and boot are properly closed.',
      'There are no warning lights that make the car unsafe to drive.',
      'The learner can complete the driving-test vehicle safety questions over time.',
    ],
    practiceIdeas: [
      'Complete a short walk-around inspection before a lesson.',
      'Choose one vehicle safety question to practise at the start of each drive.',
      'Ask the learner to identify the tyre-pressure information for the car.',
      'Discuss what they should do if a warning light appears while driving.',
    ],
    learnerQuestions: [
      'What tyre damage would stop you from driving?',
      'Which dashboard warning lights would require immediate action?',
      'How would dirty windows or mirrors affect your driving?',
      'What should you do if the car begins to feel different while driving?',
    ],
    watchOuts: [
      'Avoid memorised answers with no practical understanding.',
      'Do not ignore unfamiliar warning lights.',
      'Watch for tyres being checked visually without considering pressure or tread.',
      'Make sure loads do not obstruct windows, controls or mirrors.',
    ],
    readyWhen: [
      'The learner independently completes a sensible pre-drive safety check.',
      'They identify obvious defects and know not to drive an unsafe car.',
      'They understand the purpose of the main dashboard warnings.',
      'They can explain and demonstrate the relevant vehicle safety checks.',
    ],
  },

  3: {
    summary:
      'Set up the driving position and interior so the learner can control the car safely, see clearly and protect everyone inside.',
    covering: [
      'Doors are properly closed before moving.',
      'The seat allows full and comfortable use of every required control.',
      'The head restraint is adjusted to reduce injury risk.',
      'The steering wheel can be held comfortably with slightly bent arms.',
      'The seat belt is correctly fitted and not twisted.',
      'Interior and exterior mirrors provide the best possible view.',
      'Passengers are seated and belted safely.',
      'Loose objects and distractions are secured.',
      'The parking brake is applied before starting.',
      'The learner confirms the selector position before starting an automatic car.',
    ],
    practiceIdeas: [
      'Ask the learner to complete the full cockpit routine without prompting.',
      'Deliberately leave one item incorrectly adjusted and ask them to identify it.',
      'Compare the mirror view before and after correct adjustment.',
      'Discuss how coats, bags, phones and passengers could interfere with safe control.',
    ],
    learnerQuestions: [
      'Can you use every control fully without stretching or leaning?',
      'What should you be able to see in each mirror?',
      'Why does the head-restraint position matter?',
      'Which checks must be repeated if another person has driven the car?',
    ],
    watchOuts: [
      'A seating position that is too close or too far from the controls.',
      'Starting the engine before checking the parking brake and selector.',
      'Loose phones, bags or bottles that could move around the footwell.',
      'Passengers distracting or pressuring the learner.',
    ],
    readyWhen: [
      'The learner completes the cockpit checks in a consistent order.',
      'They can reach and operate the controls comfortably.',
      'They independently adjust the seat, head restraint, mirrors and seat belt.',
      'They check passengers, doors and loose items before moving.',
    ],
    automaticTip:
      'Before starting, keep the foot brake applied, confirm the parking brake is secure and check that the selector is in P or N as required by the vehicle.',
  },

  4: {
    summary:
      'Protect the vehicle, its keys, occupants and belongings whenever it is parked or left unattended.',
    covering: [
      'Choose a sensible and legal place to park.',
      'Apply the parking brake securely.',
      'Select P in an automatic car before switching off.',
      'Turn off the engine, lights and unnecessary electrical equipment.',
      'Close the windows and sunroof.',
      'Take the keys and lock every door.',
      'Keep keys secure and do not leave valuables visible.',
      'Check for cyclists, pedestrians and traffic before opening a door.',
      'Make sure passengers, children and animals are not left in unsafe conditions.',
    ],
    practiceIdeas: [
      'At the end of a drive, ask the learner to secure the car without prompting.',
      'Ask them to identify whether the parking location creates any risks.',
      'Practise checking mirrors and blind spots before opening the door.',
      'Discuss where keys should be stored at home and why.',
    ],
    learnerQuestions: [
      'What sequence should you follow when leaving the car?',
      'Why should valuables not be left visible?',
      'What must you check before opening the driver’s door?',
      'What risks should you consider when choosing somewhere to park?',
    ],
    watchOuts: [
      'Leaving the selector in anything other than P.',
      'Opening the door without checking for cyclists or traffic.',
      'Leaving windows open or valuables on display.',
      'Walking away without checking that the vehicle has locked.',
    ],
    readyWhen: [
      'The learner leaves the vehicle in a safe and legal position.',
      'They apply the parking brake and select the correct transmission setting.',
      'They switch everything off, take the keys and confirm the vehicle is locked.',
      'They check for road users before opening a door.',
    ],
    automaticTip:
      'Select P while holding the foot brake, apply the parking brake securely and confirm the car is fully switched off before leaving.',
  },

  5: {
    summary:
      'Locate, understand and operate the car’s controls and instruments smoothly without losing attention from the road.',
    covering: [
      'Use the accelerator and brake smoothly and progressively.',
      'Steer accurately with a relaxed and controlled grip.',
      'Operate indicators, lights, wipers, washers and demisters.',
      'Understand the speedometer and main warning lights.',
      'Use the parking brake and transmission controls correctly.',
      'Understand driver-assistance features and their limitations.',
      'Find essential controls without looking away for too long.',
    ],
    practiceIdeas: [
      'While safely parked, identify and operate each important control.',
      'Practise smooth acceleration and progressive braking on a quiet road.',
      'Operate wipers, demisters and lights while maintaining control.',
      'Discuss one driver-assistance feature and its limitations.',
    ],
    learnerQuestions: [
      'Which controls must you use without searching for them?',
      'What should you do if an unfamiliar warning light appears?',
      'How could looking down at a control affect your driving?',
      'Why must you remain responsible when assistance systems are active?',
    ],
    watchOuts: [
      'Heavy or jerky use of the accelerator and brake.',
      'Looking down for too long.',
      'Gripping the steering wheel too tightly.',
      'Assuming assistance technology will manage hazards.',
    ],
    readyWhen: [
      'The learner uses essential controls with minimal distraction.',
      'They accelerate, brake and steer smoothly.',
      'They understand the main instruments and warnings.',
      'They understand the limitations of assistance systems.',
    ],
    automaticTip:
      'Practise selecting P, R, N and D while stationary with the foot brake applied. Use the right foot for both accelerator and brake.',
  },

  6: {
    summary:
      'Move away and stop safely, smoothly and under full control in a range of positions and gradients.',
    covering: [
      'Prepare the car correctly before moving.',
      'Use effective mirror and blind-spot observations.',
      'Signal only when it helps another road user.',
      'Move away smoothly without affecting others.',
      'Move away safely from both sides, gradients and behind parked vehicles.',
      'Choose a safe, legal and convenient place to stop.',
      'Use mirrors before slowing and secure the car when stopped.',
    ],
    practiceIdeas: [
      'Repeat short move-away and stop exercises on a quiet road.',
      'Practise moving away after another vehicle or cyclist has passed.',
      'Practise stopping at different safe points near the kerb.',
      'Progress to gradients and angled starts.',
    ],
    learnerQuestions: [
      'What must you check immediately before moving?',
      'When would a signal be helpful?',
      'How do you choose a safe place to stop?',
      'What would you do if the situation changed during your final check?',
    ],
    watchOuts: [
      'Moving before an effective blind-spot check.',
      'Signalling automatically.',
      'Stopping opposite junctions or across driveways.',
      'Forgetting to secure the car after stopping.',
    ],
    readyWhen: [
      'The learner prepares, observes and moves away without prompting.',
      'They respond correctly if the situation changes.',
      'They stop safely, smoothly and suitably.',
      'They can move away on gradients and from angled positions.',
    ],
    automaticTip:
      'Select drive with the foot brake held, complete observations, release the parking brake and control creep with the brake.',
  },

  7: {
    summary:
      'Place the vehicle correctly for the road, traffic and intended direction while maintaining safe space around it.',
    covering: [
      'Keep an appropriate normal driving position.',
      'Allow safe clearance from parked vehicles and vulnerable road users.',
      'Use the correct lane on single and multi-lane roads.',
      'Position early for turns without misleading others.',
      'Maintain an appropriate following distance.',
      'Increase space in poor weather or reduced visibility.',
      'Recognise when to slow or wait at narrow gaps.',
    ],
    practiceIdeas: [
      'Use quiet roads to establish a consistent normal position.',
      'Ask the learner to describe the space around parked cars.',
      'Practise deciding when to wait at narrowings.',
      'Practise a two-second following gap in suitable conditions.',
    ],
    learnerQuestions: [
      'What risks might come from the parked vehicles ahead?',
      'How much space should you leave and why?',
      'When should you wait rather than continue?',
      'How does weather affect following distance?',
    ],
    watchOuts: [
      'Driving too close to parked vehicles.',
      'Drifting towards the kerb or centre line.',
      'Following too closely.',
      'Late or unnecessary lane changes.',
    ],
    readyWhen: [
      'The learner maintains a safe position without constant correction.',
      'They create appropriate clearance around hazards.',
      'They choose and maintain lanes correctly.',
      'They adjust space for speed, weather and visibility.',
    ],
  },

  8: {
    summary:
      'Use mirrors and direct observation to maintain an accurate picture of what is happening around the vehicle.',
    covering: [
      'Understand each mirror’s view and the remaining blind spots.',
      'Check mirrors before changing speed, direction or position.',
      'Use the correct mirrors for the intended action.',
      'Interpret the speed and distance of following traffic.',
      'Act on what is seen rather than simply moving the head.',
      'Use direct observation where mirrors are insufficient.',
      'Recheck when a developing situation may have changed.',
    ],
    practiceIdeas: [
      'Ask which mirrors are needed before each action.',
      'After a check, ask what the learner actually saw.',
      'Practise mirrors before braking, signalling, turning and lane changes.',
      'Identify vehicles entering and leaving blind spots.',
    ],
    learnerQuestions: [
      'Which mirrors matter for this action?',
      'What did you see and how does it affect your plan?',
      'Where are this car’s blind spots?',
      'When is direct observation also needed?',
    ],
    watchOuts: [
      'Checking mirrors after starting the manoeuvre.',
      'Head movements without processing the view.',
      'Ignoring a fast-approaching vehicle.',
      'Staring into mirrors for too long.',
    ],
    readyWhen: [
      'The learner checks appropriate mirrors before relevant changes.',
      'They explain what they saw accurately.',
      'They alter plans when necessary.',
      'Mirror use is timely, brief and natural.',
    ],
  },

  9: {
    summary:
      'Communicate intentions clearly using indicators, brake lights, road position and other lawful signals without misleading anyone.',
    covering: [
      'Signal clearly and early enough to be useful.',
      'Avoid signalling so early that it misleads.',
      'Use mirrors before deciding whether and when to signal.',
      'Cancel indicators after the manoeuvre.',
      'Recognise signals from vehicles and authorised people.',
      'Use the horn and flashing headlights only for their lawful purpose.',
      'Never rely completely on another road user’s signal.',
    ],
    practiceIdeas: [
      'Approach junctions and decide whether a signal is required.',
      'Compare signals that are well timed, early or late.',
      'Identify brake, reversing and hazard lights.',
      'Check indicator cancellation after turns and roundabouts.',
    ],
    learnerQuestions: [
      'Who benefits from a signal here?',
      'Could this signal be misunderstood?',
      'Can you rely on that other vehicle’s indicator?',
      'When may the horn or flashing headlights be used?',
    ],
    watchOuts: [
      'Signalling before checking mirrors.',
      'Giving signals too late or too early.',
      'Leaving indicators on.',
      'Using a signal as a substitute for observation.',
    ],
    readyWhen: [
      'The learner signals only when useful and at an effective time.',
      'Their position and speed support the signal.',
      'They cancel signals correctly.',
      'They interpret signals from others cautiously.',
    ],
  },

  10: {
    summary:
      'Identify developing hazards early, predict what may happen next and make safe plans before urgent action is needed.',
    covering: [
      'Scan well ahead, to the sides and into potential hidden areas.',
      'Recognise clues from road layout, signs, vehicles and people.',
      'Expect vulnerable road users and changing traffic conditions.',
      'Plan a safe speed, position and following distance early.',
      'Keep escape space and avoid becoming trapped by other vehicles.',
      'Update the plan as new information appears.',
    ],
    practiceIdeas: [
      'Use commentary driving to identify clues and likely hazards.',
      'Pause before a developing situation and ask what might happen next.',
      'Practise planning for parked cars, junctions, crossings and bends.',
      'Ask the learner to identify a safe alternative if the first plan becomes unsuitable.',
    ],
    learnerQuestions: [
      'What could reasonably happen next?',
      'Which clue made you think that?',
      'What can you change now to reduce the risk?',
      'Where is your safe space if the situation worsens?',
    ],
    watchOuts: [
      'Looking only at the vehicle directly ahead.',
      'Reacting late to predictable hazards.',
      'Assuming another road user has seen the learner.',
      'Continuing with the original plan after circumstances change.',
    ],
    readyWhen: [
      'The learner identifies hazards before they become urgent.',
      'They explain the clues supporting their judgement.',
      'They adjust speed, position and space in good time.',
      'They revise plans calmly as situations develop.',
    ],
  },

  11: {
    summary:
      'Choose and maintain a safe and legal speed that suits the road, visibility, weather, traffic and level of risk.',
    covering: [
      'Know and obey applicable speed limits.',
      'Treat the limit as a maximum, not a target.',
      'Reduce speed for bends, junctions, pedestrians and restricted views.',
      'Use an appropriate speed for weather, surface and traffic conditions.',
      'Make progress when conditions safely allow.',
      'Control speed smoothly through accelerator sense and progressive braking.',
    ],
    practiceIdeas: [
      'Ask the learner to identify speed-limit changes and supporting clues.',
      'Practise setting speed before bends and hazards.',
      'Compare legal speed with a genuinely safe speed in different situations.',
      'Use commentary to explain why speed is being maintained or reduced.',
    ],
    learnerQuestions: [
      'What is the limit and how do you know?',
      'Is that speed safe for what you can see?',
      'What hazard could make you reduce speed further?',
      'Are you making safe progress or holding traffic up unnecessarily?',
    ],
    watchOuts: [
      'Treating the speed limit as a target.',
      'Braking late for hazards.',
      'Driving too slowly without a safety reason.',
      'Failing to notice changes in limits.',
    ],
    readyWhen: [
      'The learner identifies limits reliably.',
      'They select a safe speed without prompting.',
      'They reduce speed early for limited views and hazards.',
      'They make safe progress when conditions allow.',
    ],
    automaticTip:
      'Use gentle accelerator release and progressive braking. Do not rely on selecting a lower drive mode as a substitute for planning and braking.',
  },

  12: {
    summary:
      'Share the road safely with other vehicles and vulnerable road users while allowing for their different needs and limitations.',
    covering: [
      'Maintain safe gaps around cars, vans, buses and lorries.',
      'Recognise large-vehicle blind spots and turning space.',
      'Give cyclists, motorcyclists, pedestrians and horse riders suitable room.',
      'Allow for emergency vehicles without creating another danger.',
      'Avoid competing for space or reacting aggressively.',
      'Understand how vehicle size, speed and visibility affect risk.',
    ],
    practiceIdeas: [
      'Identify blind spots and turning needs around larger vehicles.',
      'Practise safe passing distances where conditions permit.',
      'Discuss how to respond to emergency vehicles.',
      'Ask the learner to predict the needs of cyclists, buses and pedestrians.',
    ],
    learnerQuestions: [
      'What space might that road user need?',
      'Can the driver of that large vehicle see you?',
      'Would passing now place anyone under pressure?',
      'How can you help an emergency vehicle without creating risk?',
    ],
    watchOuts: [
      'Sitting beside a large vehicle.',
      'Passing vulnerable road users too closely.',
      'Following motorcycles or cyclists too closely.',
      'Making sudden movements for an emergency vehicle.',
    ],
    readyWhen: [
      'The learner recognises the needs of different road users.',
      'They maintain safe space and avoid blind spots.',
      'They pass only when sufficient room and visibility exist.',
      'They respond calmly and lawfully to unusual situations.',
    ],
  },

  13: {
    summary:
      'Drive smoothly and efficiently by planning ahead, avoiding unnecessary acceleration and braking, and reducing wasted energy.',
    covering: [
      'Accelerate smoothly and avoid unnecessary high power.',
      'Read the road ahead and release the accelerator early.',
      'Maintain safe, steady progress where appropriate.',
      'Avoid unnecessary idling and electrical use.',
      'Keep tyres correctly inflated and the vehicle properly maintained.',
      'Understand that safety and control always take priority over efficiency.',
    ],
    practiceIdeas: [
      'Compare a planned approach to a junction with late acceleration and braking.',
      'Practise maintaining a steady speed using good observation.',
      'Ask the learner to identify opportunities to ease off early.',
      'Discuss how tyre pressure, loads and maintenance affect efficiency.',
    ],
    learnerQuestions: [
      'Could you have eased off earlier here?',
      'What caused that unnecessary braking?',
      'How does planning improve both safety and efficiency?',
      'When must efficiency give way to safety?',
    ],
    watchOuts: [
      'Coasting or compromising control to save fuel.',
      'Accelerating towards a red light or queue.',
      'Driving too slowly in the name of efficiency.',
      'Ignoring maintenance or tyre pressures.',
    ],
    readyWhen: [
      'The learner plans ahead and avoids repeated acceleration and braking.',
      'They maintain smooth, safe progress.',
      'They understand vehicle condition affects efficiency.',
      'They never compromise safety to save fuel or energy.',
    ],
    automaticTip:
      'Use smooth accelerator inputs and allow the car to slow naturally when safe. Avoid repeatedly switching between accelerator and brake.',
  },

  14: {
    summary:
      'Approach, assess and negotiate junctions safely while observing effectively and giving way correctly.',
    covering: [
      'Identify junction types and priorities early.',
      'Use mirrors, signals, position, speed and observation flexibly.',
      'Approach at a speed that allows a safe decision.',
      'Observe in all relevant directions and recognise restricted views.',
      'Judge safe gaps without causing others to alter course or speed.',
      'Turn accurately without cutting corners or swinging wide.',
      'Deal with emerging, open, closed and staggered junctions.',
    ],
    practiceIdeas: [
      'Start with quiet T-junctions before progressing to busier or restricted ones.',
      'Practise approaching to stop and approaching to continue when clearly safe.',
      'Ask the learner to explain priority and available gaps.',
      'Practise left and right turns with accurate positioning.',
    ],
    learnerQuestions: [
      'Who has priority here?',
      'Can you see enough to make a safe decision?',
      'What speed lets you stop if needed?',
      'Would taking that gap affect another road user?',
    ],
    watchOuts: [
      'Approaching too quickly.',
      'Looking without seeing or deciding.',
      'Emerging into an unsafe gap.',
      'Cutting the corner on right turns.',
      'Assuming priority guarantees safety.',
    ],
    readyWhen: [
      'The learner identifies junctions and priorities early.',
      'They approach at a suitable speed and position.',
      'They make safe gap decisions without prompting.',
      'They turn accurately and continue to observe.',
    ],
  },

  15: {
    summary:
      'Approach and use roundabouts safely by choosing the correct lane, judging gaps and signalling clearly.',
    covering: [
      'Identify the intended exit and read signs and road markings early.',
      'Choose and maintain the correct lane.',
      'Approach at a controlled speed with effective observation.',
      'Give priority as required and judge a safe gap.',
      'Signal correctly on approach and exit.',
      'Maintain lane discipline through the roundabout.',
      'Handle mini-roundabouts and multi-lane roundabouts.',
    ],
    practiceIdeas: [
      'Begin with quiet mini-roundabouts and simple single-lane layouts.',
      'Practise reading signs before reaching the roundabout.',
      'Ask the learner to identify the chosen lane and exit.',
      'Progress to busier and multi-lane layouts when ready.',
    ],
    learnerQuestions: [
      'Which exit and lane do you need?',
      'Who must you give way to?',
      'Is that gap large enough without making anyone react?',
      'When should you signal to leave?',
    ],
    watchOuts: [
      'Approaching too quickly.',
      'Watching only traffic from the right.',
      'Poor lane discipline or late lane changes.',
      'Missing the exit signal.',
      'Relying completely on another vehicle’s indicator.',
    ],
    readyWhen: [
      'The learner plans the exit and lane early.',
      'They approach at a controlled speed.',
      'They judge gaps safely and maintain lane discipline.',
      'They signal and exit without prompting.',
    ],
  },

  16: {
    summary:
      'Recognise and deal safely with pedestrian crossings while anticipating people who may enter the road unexpectedly.',
    covering: [
      'Identify zebra, pelican, puffin, toucan and school crossings.',
      'Check mirrors and reduce speed when approaching.',
      'Recognise people waiting, approaching or obscured from view.',
      'Stop safely when required and avoid blocking the crossing.',
      'Wait until the crossing is clear before moving.',
      'Do not wave or pressure pedestrians into crossing.',
    ],
    practiceIdeas: [
      'Identify different crossing types on a varied route.',
      'Ask the learner to explain when they must stop.',
      'Practise approaching with enough space to brake smoothly.',
      'Discuss hidden pedestrians near parked vehicles and buses.',
    ],
    learnerQuestions: [
      'What type of crossing is this?',
      'Who might enter the road?',
      'Where should you stop?',
      'When is it safe and legal to move again?',
    ],
    watchOuts: [
      'Approaching too quickly.',
      'Focusing on the lights but not the people.',
      'Stopping on the crossing.',
      'Moving before everyone has cleared the learner’s path.',
    ],
    readyWhen: [
      'The learner identifies crossing types early.',
      'They approach at an appropriate speed.',
      'They stop smoothly and correctly when required.',
      'They continue only after checking it is safe.',
    ],
  },

  17: {
    summary:
      'Reverse slowly and accurately while making effective all-round observations and responding to anyone who enters the area.',
    covering: [
      'Prepare the car and select reverse safely.',
      'Make all-round observations before and during movement.',
      'Control speed at walking pace or slower.',
      'Steer accurately while understanding the car’s path.',
      'Pause and reassess if a person or vehicle approaches.',
      'Use reversing aids only as support, not as a replacement for observation.',
    ],
    practiceIdeas: [
      'Practise short straight reverses in a quiet area.',
      'Reverse around gentle bends or into marked areas.',
      'Ask the learner to stop whenever observation is lost.',
      'Compare mirror, direct and camera views.',
    ],
    learnerQuestions: [
      'Which areas can you not currently see?',
      'Where will the front of the car swing?',
      'What would make you stop immediately?',
      'Why is the camera not enough on its own?',
    ],
    watchOuts: [
      'Moving before completing all-round observations.',
      'Reversing too quickly.',
      'Staring in one direction.',
      'Relying only on sensors or a camera.',
    ],
    readyWhen: [
      'The learner reverses slowly and accurately.',
      'They maintain effective observation throughout.',
      'They stop promptly when risk appears.',
      'They use aids appropriately without depending on them.',
    ],
    automaticTip:
      'Control creep mainly with the brake and use only light accelerator if genuinely needed.',
  },

  18: {
    summary:
      'Turn the car around safely using an appropriate method while maintaining control and continuous observation.',
    covering: [
      'Choose a safe, legal and suitable location.',
      'Decide whether a turn in the road or another method is appropriate.',
      'Control the car slowly during forward and reverse movements.',
      'Observe in every direction throughout.',
      'Allow for the front and rear of the vehicle swinging.',
      'Stop and give way whenever another road user is affected.',
    ],
    practiceIdeas: [
      'Practise in a wide, quiet road before narrower locations.',
      'Ask the learner to plan the number and direction of movements.',
      'Introduce changing gradients and camber later.',
      'Discuss when it would be safer to continue and turn elsewhere.',
    ],
    learnerQuestions: [
      'Is this a safe place to turn?',
      'Who could be affected?',
      'Where will each end of the car move?',
      'Would another turning method be safer?',
    ],
    watchOuts: [
      'Choosing a location near bends or junctions.',
      'Moving without effective observation.',
      'Rushing to complete the turn.',
      'Continuing when another road user approaches.',
    ],
    readyWhen: [
      'The learner selects a suitable location.',
      'They turn under slow, accurate control.',
      'They observe continuously and respond to others.',
      'They abandon or alter the plan when necessary.',
    ],
    automaticTip:
      'Use controlled creep and brake pressure. Pause fully before changing between D and R.',
  },

  19: {
    summary:
      'Park safely and accurately in different situations while controlling the car slowly and observing continuously.',
    covering: [
      'Choose a safe and legal parking place.',
      'Complete parallel, bay and roadside parking where appropriate.',
      'Use reference points flexibly rather than relying on one fixed routine.',
      'Maintain all-round observation throughout.',
      'Control speed and steering accurately.',
      'Finish within the space and secure the vehicle correctly.',
      'Correct the position safely when needed.',
    ],
    practiceIdeas: [
      'Begin in quiet, spacious bays before tighter spaces.',
      'Practise both forward and reverse bay parking.',
      'Build parallel parking from larger to smaller gaps.',
      'Ask the learner to assess and correct the final position.',
    ],
    learnerQuestions: [
      'Is this space safe and legal?',
      'Which road users could enter the area?',
      'Where will the car swing?',
      'Does the final position need correcting?',
    ],
    watchOuts: [
      'Focusing on reference points instead of observation.',
      'Moving too quickly.',
      'Ignoring pedestrians or vehicles entering the area.',
      'Finishing outside the space or too far from the kerb.',
    ],
    readyWhen: [
      'The learner chooses suitable spaces.',
      'They park slowly with continuous observation.',
      'They finish accurately and correct safely when needed.',
      'They secure the vehicle independently.',
    ],
    automaticTip:
      'Use brake-controlled creep and pause before changing direction. Avoid unnecessary accelerator use in confined spaces.',
  },

  20: {
    summary:
      'Stop the vehicle quickly, safely and under control in response to an emergency.',
    covering: [
      'React promptly to the instruction or hazard.',
      'Brake firmly and progressively while maintaining control.',
      'Keep the steering stable and understand ABS operation.',
      'Secure the vehicle after stopping.',
      'Complete effective observations before moving away again.',
      'Understand that the exercise must only be practised in a safe location.',
    ],
    practiceIdeas: [
      'Explain the procedure while stationary first.',
      'Practise only on a quiet, suitable road with clear agreement.',
      'Begin at a modest speed and increase only when safe.',
      'Discuss how wet or loose surfaces change stopping distance.',
    ],
    learnerQuestions: [
      'What is the priority during an emergency stop?',
      'How might ABS feel through the pedal?',
      'What checks are needed before moving again?',
      'How would poor conditions affect the stop?',
    ],
    watchOuts: [
      'Looking in mirrors before braking during the emergency itself.',
      'Braking timidly or releasing pressure too soon.',
      'Grabbing or turning the steering unnecessarily.',
      'Moving away without all-round checks.',
    ],
    readyWhen: [
      'The learner reacts promptly.',
      'They stop firmly without losing control.',
      'They secure the vehicle correctly.',
      'They complete observations before moving away.',
    ],
    automaticTip:
      'Brake firmly with the right foot and keep it applied after stopping. There is no clutch pedal to press.',
  },

  21: {
    summary:
      'Drive safely on country roads by adjusting speed and position for limited views, changing surfaces and unexpected hazards.',
    covering: [
      'Read bends, hills, dips and changing road widths early.',
      'Choose a speed that allows stopping within the visible distance.',
      'Expect walkers, cyclists, horses, animals and slow vehicles.',
      'Use appropriate positioning without crossing the centre line.',
      'Deal safely with narrow roads and passing places.',
      'Recognise mud, gravel, standing water and poor edges.',
    ],
    practiceIdeas: [
      'Start on wider rural roads before narrow lanes.',
      'Use commentary to identify hidden hazards and escape space.',
      'Practise slowing before bends rather than during them.',
      'Discuss how to pass horses and vulnerable road users safely.',
    ],
    learnerQuestions: [
      'Can you stop within the distance you can see?',
      'What could be hidden beyond this bend or brow?',
      'Where would you wait if another vehicle appeared?',
      'How does the road surface affect your plan?',
    ],
    watchOuts: [
      'Treating the national speed limit as a target.',
      'Cutting bends or crossing the centre line.',
      'Approaching blind bends too quickly.',
      'Passing horses or cyclists too closely.',
    ],
    readyWhen: [
      'The learner matches speed to visibility.',
      'They anticipate hidden rural hazards.',
      'They position safely through bends and narrow sections.',
      'They remain calm when meeting oncoming traffic.',
    ],
  },

  22: {
    summary:
      'Join, drive on and leave dual carriageways safely while using appropriate speed, lane discipline and observation.',
    covering: [
      'Use slip roads to build a suitable joining speed.',
      'Judge gaps and merge without forcing others to react.',
      'Keep left unless overtaking or signs require otherwise.',
      'Use mirrors and blind-spot checks before lane changes.',
      'Maintain safe following distances at higher speeds.',
      'Read signs early and plan exits in good time.',
      'Deal with breakdowns and emergency areas appropriately.',
    ],
    practiceIdeas: [
      'Begin on quieter dual carriageways.',
      'Practise joining and leaving at different junctions.',
      'Ask the learner to plan lane changes before acting.',
      'Practise maintaining safe gaps at higher speeds.',
    ],
    learnerQuestions: [
      'Which gap are you planning to join?',
      'Is your speed suitable for the traffic flow?',
      'Why are you in this lane?',
      'When should you begin preparing for the exit?',
    ],
    watchOuts: [
      'Joining too slowly or stopping on the slip road unnecessarily.',
      'Remaining in an overtaking lane.',
      'Changing lanes without a blind-spot check.',
      'Following too closely at speed.',
    ],
    readyWhen: [
      'The learner joins and leaves without prompting.',
      'They maintain suitable speed and spacing.',
      'They use lanes correctly.',
      'They plan signs, exits and lane changes early.',
    ],
  },

  23: {
    summary:
      'Understand motorway driving, including joining, lane discipline, high-speed planning, signs, breakdowns and smart-motorway features.',
    covering: [
      'Motorway practice is instructor-only in a dual-control car.',
      'Join and leave using slip roads and suitable speed.',
      'Keep left unless overtaking.',
      'Maintain large safety margins and plan well ahead.',
      'Understand overhead signs, red X signals and variable limits.',
      'Know what to do during a breakdown or emergency.',
      'Manage fatigue, weather and long-distance concentration.',
    ],
    practiceIdeas: [
      'Study motorway signs and procedures before any practical session.',
      'Use dual carriageways to prepare lane and speed skills.',
      'With an instructor, practise joining, overtaking and leaving.',
      'Discuss breakdown procedures and emergency areas.',
    ],
    learnerQuestions: [
      'Who may supervise a learner on a motorway?',
      'What does a red X mean?',
      'Where should you normally drive?',
      'What would you do if the car broke down?',
    ],
    watchOuts: [
      'Private motorway practice with an ordinary supervisor.',
      'Ignoring red X signals or variable limits.',
      'Middle-lane or right-lane hogging.',
      'Underestimating fatigue and stopping distance.',
    ],
    readyWhen: [
      'The learner explains motorway rules and emergency procedures.',
      'With an instructor, they join and leave safely.',
      'They maintain lane discipline and safe gaps.',
      'They respond correctly to signs and changing conditions.',
    ],
    automaticTip:
      'Use smooth acceleration to match motorway traffic and avoid abrupt pedal inputs. Driver-assistance systems do not replace observation.',
  },

  24: {
    summary:
      'Drive safely in darkness and reduced light by using lights correctly, controlling speed and managing reduced visibility.',
    covering: [
      'Use sidelights, dipped headlights and main beam correctly.',
      'Dip headlights to avoid dazzling others.',
      'Adjust speed to the distance visible in the headlights.',
      'Recognise pedestrians, cyclists and unlit hazards.',
      'Manage glare from oncoming and following vehicles.',
      'Keep windows, lights and mirrors clean.',
    ],
    practiceIdeas: [
      'Practise at dusk before full darkness.',
      'Identify when to change between dipped and main beam.',
      'Compare safe speed on lit and unlit roads.',
      'Discuss glare management and clean glass.',
    ],
    learnerQuestions: [
      'Which lights are appropriate now?',
      'Can you stop within the distance you can see?',
      'Who could be difficult to see here?',
      'How can you reduce the effect of glare?',
    ],
    watchOuts: [
      'Driving too quickly for the visible distance.',
      'Failing to dip main beam.',
      'Looking directly at bright oncoming lights.',
      'Using fog lights without suitable conditions.',
    ],
    readyWhen: [
      'The learner selects and changes lights correctly.',
      'They match speed to visibility.',
      'They identify poorly lit road users and hazards.',
      'They manage glare without losing control.',
    ],
  },

  25: {
    summary:
      'Adapt driving safely for rain, fog, ice, snow, wind, heat and other conditions that affect grip, visibility and control.',
    covering: [
      'Increase following distance and reduce speed.',
      'Use lights, wipers, demisters and ventilation correctly.',
      'Recognise aquaplaning, ice and reduced grip.',
      'Brake, steer and accelerate smoothly.',
      'Allow for strong winds and spray.',
      'Decide when conditions are too dangerous to continue.',
    ],
    practiceIdeas: [
      'Discuss weather risks before setting off.',
      'Practise smooth control in ordinary rain before worse conditions.',
      'Compare stopping and following distances.',
      'Plan safe alternatives if conditions deteriorate.',
    ],
    learnerQuestions: [
      'How has this weather changed the available grip?',
      'What following gap is appropriate?',
      'Which controls improve visibility?',
      'At what point should the journey stop?',
    ],
    watchOuts: [
      'Driving at normal dry-road speed.',
      'Harsh braking or steering on poor surfaces.',
      'Using inappropriate lights.',
      'Continuing when visibility or grip becomes unsafe.',
    ],
    readyWhen: [
      'The learner adapts speed and spacing early.',
      'They use visibility controls correctly.',
      'They drive smoothly in reduced grip.',
      'They recognise when not to continue.',
    ],
    automaticTip:
      'Use gentle accelerator and brake inputs. Avoid abrupt kickdown or sudden changes in drive mode on slippery surfaces.',
  },

  26: {
    summary:
      'Carry passengers, animals and loads safely without affecting control, visibility, vehicle limits or concentration.',
    covering: [
      'Ensure everyone uses suitable restraints and seat belts.',
      'Secure animals and loose objects.',
      'Keep windows, mirrors and controls unobstructed.',
      'Stay within vehicle and tyre load limits.',
      'Adjust tyre pressures where the manufacturer requires it.',
      'Allow for changed braking, handling and acceleration.',
      'Manage distracting or pressuring passengers.',
    ],
    practiceIdeas: [
      'Inspect the car for loose objects before a drive.',
      'Discuss safe placement of luggage and animals.',
      'Compare vehicle response when carrying additional weight.',
      'Agree expectations with passengers before setting off.',
    ],
    learnerQuestions: [
      'Is every person and item secured?',
      'Could anything interfere with controls or visibility?',
      'How might this load change braking and handling?',
      'What would you do about a distracting passenger?',
    ],
    watchOuts: [
      'Loose objects in the cabin.',
      'Passengers without suitable restraints.',
      'Loads blocking mirrors or exceeding limits.',
      'Allowing passengers to pressure the learner.',
    ],
    readyWhen: [
      'The learner checks passengers and loads before moving.',
      'They secure items and animals correctly.',
      'They adapt driving for additional weight.',
      'They manage distractions firmly and safely.',
    ],
  },

  27: {
    summary:
      'Follow a route independently using signs or a sat nav while continuing to drive safely, plan ahead and recover calmly from mistakes.',
    covering: [
      'Set up the route before moving.',
      'Position the device so it does not obstruct the view.',
      'Listen to directions without staring at the screen.',
      'Read signs and road markings early.',
      'Use normal observation and planning routines throughout.',
      'Continue safely if a direction is missed.',
      'Pull over safely before changing the route or device.',
    ],
    practiceIdeas: [
      'Begin with a familiar short route using spoken directions.',
      'Progress to following signs to a known destination.',
      'Use a sat nav on increasingly unfamiliar routes.',
      'Deliberately miss a direction and practise recovering calmly.',
    ],
    learnerQuestions: [
      'What does the next direction mean for your lane and position?',
      'Can you follow it safely from here?',
      'What should you do if you miss the turn?',
      'When is it safe to alter the device?',
    ],
    watchOuts: [
      'Staring at the screen.',
      'Making sudden lane changes to follow a late instruction.',
      'Treating the sat nav as more important than signs or road conditions.',
      'Handling the device while moving.',
    ],
    readyWhen: [
      'The learner follows directions while maintaining safe observation.',
      'They plan lanes and turns early.',
      'They ignore unsafe instructions and continue safely.',
      'They recover calmly after missed directions.',
    ],
  },
}
