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
}