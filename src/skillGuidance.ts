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
      'The driver is responsible for driving safely and following the Highway Code.',
      'Mobile phone, alcohol, drug, medication and seat-belt rules still apply during practice.',
      'Private practice is not permitted on motorways unless the learner is with an approved driving instructor in a dual-control car.',
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
      'Check that the supervisor is legally eligible and insured where required.',
      'Do not begin practice when either person is tired, angry, distracted or unwell.',
      'Do not treat private practice as less serious than a formal lesson.',
    ],

    readyWhen: [
      'The learner can explain the main legal requirements without being prompted.',
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
      'The learner understands the dashboard warning lights relevant to the practice car.',
      'The learner can complete the driving-test vehicle safety questions over time.',
    ],

    practiceIdeas: [
      'Complete a short walk-around inspection before a lesson.',
      'Choose one vehicle safety question to practise at the start of each drive.',
      'Ask the learner to identify the tyre-pressure information for the car.',
      'Discuss what they should do if a warning light appears while driving.',
      'Practise cleaning and correctly adjusting the windows and mirrors before departure.',
    ],

    learnerQuestions: [
      'What tyre damage would stop you from driving?',
      'Which dashboard warning lights would require immediate action?',
      'How would dirty windows or mirrors affect your driving?',
      'What should you do if the car begins to feel different while driving?',
    ],

    watchOuts: [
      'Avoid turning the checks into memorised answers with no practical understanding.',
      'Do not ignore unfamiliar warning lights.',
      'Watch for tyres being checked visually without considering pressure or tread.',
      'Make sure loads or objects are not obstructing windows, controls or mirrors.',
    ],

    readyWhen: [
      'The learner independently completes a sensible pre-drive safety check.',
      'They can identify obvious defects and know not to drive an unsafe car.',
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
      'Deliberately leave one item incorrectly adjusted and ask them to identify it before starting.',
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
      'Mirrors adjusted to reduce blind spots unrealistically instead of providing a balanced view.',
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
      'Keep keys secure and away from easy access inside the home.',
      'Do not leave valuables visible in the vehicle.',
      'Use the alarm, immobiliser or steering lock correctly where fitted.',
      'Check for cyclists, pedestrians and traffic before opening a door.',
      'Use a safe door-opening method, such as opening with the hand furthest from the door where appropriate.',
      'Make sure passengers, children and animals are not left in unsafe conditions.',
    ],

    practiceIdeas: [
      'At the end of a drive, ask the learner to secure the car without prompting.',
      'Ask them to identify whether the chosen parking location creates any security or safety risks.',
      'Practise checking mirrors and blind spots before opening the door.',
      'Discuss where keys should be stored at home and why.',
      'Place a bag visibly on a seat and ask what should be done before leaving.',
    ],

    learnerQuestions: [
      'What sequence should you follow when leaving the car?',
      'Why should valuables not be left visible, even in a locked vehicle?',
      'What must you check before opening the driver’s door?',
      'Where should the vehicle keys be kept at home?',
      'What risks should you consider when choosing somewhere to park?',
    ],

    watchOuts: [
      'Leaving the automatic selector in anything other than P.',
      'Relying only on the parking brake without checking the car is fully secured.',
      'Opening the door without checking for cyclists or other traffic.',
      'Leaving windows slightly open or valuables on display.',
      'Walking away without checking that the vehicle has actually locked.',
      'Leaving the keys in or near the vehicle.',
    ],

    readyWhen: [
      'The learner independently leaves the vehicle in a safe and legal position.',
      'They apply the parking brake and select the correct transmission setting.',
      'They switch everything off, take the keys and confirm the vehicle is locked.',
      'They check for road users before opening a door.',
      'They can explain how parking location, key storage and visible valuables affect security.',
    ],

    automaticTip:
      'Select P while holding the foot brake, apply the parking brake securely and confirm the car is fully switched off before removing the key or leaving the vehicle.',
  },

  5: {
    summary:
      'Locate, understand and operate the car’s controls and instruments smoothly without losing attention from the road.',

    covering: [
      'Use the accelerator and brake smoothly and progressively.',
      'Steer accurately while keeping a relaxed and controlled grip.',
      'Operate indicators, lights, wipers, washers, demisters and heating controls.',
      'Understand the speedometer, fuel or battery gauge and other main instruments.',
      'Recognise important warning lights and know when it is unsafe to continue.',
      'Use the parking brake and transmission controls correctly.',
      'Understand any driving modes fitted to the car.',
      'Understand driver-assistance features such as cruise control, speed limiters, lane assistance and automatic emergency braking.',
      'Know that driver-assistance technology supports the driver but does not replace observation or responsibility.',
      'Find essential controls without looking away from the road for too long.',
      'Adapt safely when using an unfamiliar vehicle.',
    ],

    practiceIdeas: [
      'While safely parked, ask the learner to identify and operate each important control.',
      'On a quiet road, practise smooth acceleration followed by progressive braking.',
      'Ask the learner to operate the wipers, demister and lights while maintaining safe control.',
      'Discuss what each commonly seen dashboard warning light means.',
      'Practise steering around gentle bends without crossing hands excessively or gripping too tightly.',
      'Explain one driver-assistance feature and then discuss its limitations.',
    ],

    learnerQuestions: [
      'Which controls must you be able to use without searching for them?',
      'What should you do if an unfamiliar warning light appears?',
      'How could looking down at a control affect your driving?',
      'What driver-assistance features does this car have?',
      'Why must you remain fully responsible even when assistance systems are active?',
    ],

    watchOuts: [
      'Heavy or jerky use of the accelerator and brake.',
      'Looking down for too long when finding controls.',
      'Gripping the steering wheel tightly or allowing it to spin back uncontrolled.',
      'Confusing similar controls in an unfamiliar car.',
      'Assuming lane assistance, cruise control or automatic braking will manage hazards.',
      'Changing settings at a time when full attention is needed elsewhere.',
    ],

    readyWhen: [
      'The learner locates and uses essential controls with minimal distraction.',
      'They accelerate, brake and steer smoothly and accurately.',
      'They understand the main instruments and warning lights.',
      'They can operate ancillary controls while maintaining safe observation and control.',
      'They understand both the purpose and limitations of driver-assistance systems.',
    ],

    automaticTip:
      'Practise selecting P, R, N and D correctly while stationary with the foot brake applied. Use only the right foot for the accelerator and brake unless the vehicle manufacturer specifically states otherwise.',
  },

  6: {
    summary:
      'Move away and stop safely, smoothly and under full control in a range of positions and gradients.',

    covering: [
      'Prepare the car correctly before moving.',
      'Use effective mirror and blind-spot observations before moving away.',
      'Signal only when it would help another road user.',
      'Move away smoothly without causing others to change speed or direction.',
      'Move away from the left and right side of the road where appropriate.',
      'Move away safely at an angle from behind a parked vehicle.',
      'Move away uphill and downhill under control.',
      'Choose a safe, legal and convenient place to stop.',
      'Use mirrors before slowing or changing position.',
      'Stop smoothly and reasonably close to the kerb.',
      'Secure the car correctly once stopped.',
      'Use the MSM and PSL routines as flexible decision-making routines rather than a rushed script.',
    ],

    practiceIdeas: [
      'Repeat short move-away and stop exercises on a quiet road.',
      'Ask the learner to explain what they can see in each mirror and blind spot before moving.',
      'Practise moving away after another vehicle or cyclist has passed.',
      'Practise stopping at different safe points while judging distance from the kerb.',
      'Progress to moving away uphill, downhill and from behind a parked car.',
      'Ask the learner to decide whether a signal would genuinely benefit anyone.',
    ],

    learnerQuestions: [
      'What must you check immediately before moving?',
      'When would a signal be helpful before moving away?',
      'How do you choose a safe place to stop?',
      'Why should you check mirrors before slowing?',
      'What would you do if another road user appeared during your final observation?',
    ],

    watchOuts: [
      'Moving before completing an effective blind-spot check.',
      'Treating mirror checks as head movements without understanding what was seen.',
      'Signalling automatically when the signal may confuse others.',
      'Accelerating before the learner has confirmed it is safe.',
      'Stopping opposite junctions, across driveways or too close to hazards.',
      'Stopping too far from or striking the kerb.',
      'Forgetting to secure the car after stopping.',
    ],

    readyWhen: [
      'The learner prepares, observes and moves away without prompting.',
      'They respond correctly if the situation changes during the final checks.',
      'They stop safely, smoothly and in a suitable position.',
      'They can move away on gradients and from angled positions under control.',
      'Their observations and signals are based on what is actually happening around them.',
    ],

    automaticTip:
      'With the foot brake held, select the correct drive position, complete observations and release the parking brake when safe. Control creep with the brake and add gentle accelerator only when needed.',
  },

  7: {
    summary:
      'Place the vehicle correctly for the road, traffic and intended direction while maintaining safe space around it.',

    covering: [
      'Keep an appropriate normal driving position.',
      'Allow safe clearance from parked vehicles, cyclists, pedestrians and roadside hazards.',
      'Avoid driving unnecessarily close to the kerb or centre line.',
      'Use the correct lane on single and multi-lane roads.',
      'Position early for turns and other changes of direction.',
      'Maintain an appropriate following distance.',
      'Increase space in poor weather or when visibility is reduced.',
      'Avoid travelling in another vehicle’s blind spot.',
      'Understand how positioning communicates intentions to other road users.',
      'Adjust position when passing narrowings, obstructions or vulnerable road users.',
      'Avoid squeezing through a gap simply because the car physically fits.',
    ],

    practiceIdeas: [
      'Use quiet roads to establish a consistent normal driving position.',
      'Ask the learner to describe the space they are leaving around parked cars.',
      'Practise identifying when to wait rather than enter a narrow gap.',
      'Use different road widths to practise adjusting lateral position.',
      'Practise maintaining at least a two-second following gap in suitable conditions.',
      'Ask the learner to choose lanes early using signs and road markings.',
    ],

    learnerQuestions: [
      'What risks might come from the parked vehicles ahead?',
      'How much space should you leave and why?',
      'When should you wait rather than continue through a narrowing?',
      'How does weather affect your following distance?',
      'What might your road position communicate to someone else?',
    ],

    watchOuts: [
      'Driving too close to parked vehicles and failing to allow for opening doors.',
      'Drifting towards the kerb or centre line.',
      'Following another vehicle too closely.',
      'Changing lanes late or without a clear reason.',
      'Positioning for a turn so early that it misleads others.',
      'Trying to maintain a fixed position when conditions require adjustment.',
      'Passing cyclists or pedestrians without sufficient space.',
    ],

    readyWhen: [
      'The learner maintains a safe and stable position without constant correction.',
      'They create appropriate clearance around vulnerable road users and hazards.',
      'They choose and maintain lanes correctly.',
      'They adjust following distance for speed, weather and visibility.',
      'They recognise when limited space means they should slow or wait.',
    ],
  },

  8: {
    summary:
      'Use mirrors and direct observation to maintain an accurate picture of what is happening around the vehicle.',

    covering: [
      'Understand the view provided by the interior and exterior mirrors.',
      'Understand that mirrors leave blind spots.',
      'Check mirrors before changing speed, direction or road position.',
      'Use the correct mirrors for the intended action.',
      'Interpret the speed, distance and intentions of following traffic.',
      'Act appropriately on what is seen rather than merely moving the head.',
      'Use direct observation where mirrors do not provide enough information.',
      'Understand that convex mirrors can make vehicles appear further away.',
      'Recheck mirrors when a developing situation may have changed.',
      'Maintain awareness of cyclists, motorcyclists and other easily hidden road users.',
    ],

    practiceIdeas: [
      'Ask the learner to name which mirrors they need before each planned action.',
      'Pause after a mirror check and ask what they actually saw.',
      'Practise checking mirrors before braking, signalling, turning and changing lanes.',
      'Identify vehicles entering and leaving the learner’s blind spots.',
      'Compare the apparent distance of a vehicle in the interior and exterior mirrors.',
      'Ask the learner to comment when a following vehicle affects their decision.',
    ],

    learnerQuestions: [
      'Which mirrors are most relevant for this action?',
      'What did you see and how does it affect your plan?',
      'Where are this car’s blind spots?',
      'Why might a vehicle look further away in an exterior mirror?',
      'When would you need direct observation as well as mirrors?',
    ],

    watchOuts: [
      'Performing mirror checks after beginning the manoeuvre.',
      'Moving the head without properly processing the view.',
      'Checking only one mirror automatically for every action.',
      'Failing to respond to a fast-approaching vehicle.',
      'Forgetting blind spots when moving away or changing position.',
      'Staring into mirrors for too long and neglecting the road ahead.',
    ],

    readyWhen: [
      'The learner checks the appropriate mirrors before every relevant change.',
      'They accurately explain what they have seen.',
      'They alter their plan when mirror information makes that necessary.',
      'They use direct observations to cover blind spots.',
      'Their mirror use is timely, brief and integrated naturally into their driving.',
    ],
  },

  9: {
    summary:
      'Communicate intentions clearly using indicators, brake lights, road position and other lawful signals without misleading anyone.',

    covering: [
      'Understand why signals help other road users plan safely.',
      'Signal clearly and early enough to be useful.',
      'Avoid signalling so early that it could mislead others.',
      'Use mirrors before deciding whether and when to signal.',
      'Cancel indicators after completing the manoeuvre.',
      'Recognise when a signal is unnecessary.',
      'Understand signals from other vehicles, including indicators, brake lights, reversing lights and hazard lights.',
      'Understand signals from police officers, traffic officers, school crossing patrols and other authorised people.',
      'Know the correct use of the horn and flashing headlights.',
      'Understand that road position and speed can reinforce or contradict an indicator.',
      'Never rely completely on another road user’s signal.',
    ],

    practiceIdeas: [
      'Approach several junctions and ask the learner to decide whether a signal is required.',
      'Compare an appropriately timed signal with one that would be too early or too late.',
      'Practise recognising brake lights, reversing lights and hazard warning lights.',
      'Ask the learner to identify how road position supports the signal being given.',
      'Discuss situations where another driver’s indicator may be misleading.',
      'Practise checking that the indicator has cancelled after turns and roundabouts.',
    ],

    learnerQuestions: [
      'Who would benefit from a signal here?',
      'Could this signal be misunderstood because of another junction or entrance?',
      'What does that other vehicle’s signal suggest, and can you rely on it?',
      'How does your position support the signal you are giving?',
      'When may the horn or flashing headlights legally be used?',
    ],

    watchOuts: [
      'Signalling before checking mirrors.',
      'Giving signals too late to help anyone.',
      'Signalling too early near another road or entrance.',
      'Leaving indicators on after the manoeuvre.',
      'Using a signal as a substitute for observation.',
      'Assuming another vehicle will definitely act according to its indicator.',
      'Using the horn or headlights to express irritation or give way.',
    ],

    readyWhen: [
      'The learner signals only when useful and does so at an effective time.',
      'Their mirrors, position and speed support the signal.',
      'They cancel signals and recognise when an indicator has remained active.',
      'They correctly interpret common signals from others while remaining cautious.',
      'They avoid giving misleading or unnecessary signals.',
    ],
  },
}