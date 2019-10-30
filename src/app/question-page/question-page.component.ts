import { Component, OnInit, HostBinding } from '@angular/core';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { Router } from '@angular/router';
import { routePageAnimation } from '../animations';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.css'],
  animations: [
    trigger('questionAnimation', [
      transition(":increment", [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('1s cubic-bezier(.24,.09,.34,.99)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    routePageAnimation
  ]
})
export class QuestionPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  langKey = 'en';

  questions = [{
    type: 'multi',
    en: 'Select your gender.',
    choices: ['female', 'male', 'divers']
  }, {
    type: 'multi',
    en: 'Please select your age.',
    choices: [
      '24 or younger', '25 - 32', '33 - 38', '39 - 56', '57 or older'
    ]
  }, {
    type: 'multi',
    en: 'Select your approximate educational qualification.',
    choices: [
      'None',
      'Highschool',
      'College',
      'University'
    ]
  }, {
    type: 'binary',
    en: 'Have you ever received psychiatric or psychotherapeutic treatment?'
  }, {
    type: 'multi',
    en: `How much do you agree to the phrase "I am a creative person"?`,
    choices: [
      
      'Strongly Disagree',
      'Disagree',
      'Undecided',
      'Agree',
      'Strongly Agree',
      
    ]
  },{
    type: 'multi',
    en: `How much do you agree to the phrase "I am a disciplined person"?`,
    choices: [
      'Strongly Disagree',
      'Disagree',
      'Undecided',
      'Agree',
      'Strongly Agree',
    ]
  }, {
    type: 'multi',
    en: `How much do you agree to the phrase "I am prone to emotional instability"?`,
    choices: [
      'Strongly Disagree',
      'Disagree',
      'Undecided',
      'Agree',
      'Strongly Agree',
    ]
  }, {
    type: 'multi',
    en: 'Do you have a fear of being the center of attention while behaving in an awkward or clumsy manner?',
    choices: [
      'Always', 'Often', 'Sometimes', 'Rarely', 'Never'
    ]
  }, {
    type: 'multi',
    en: 'Do you remain calm in unexpectedly stressful situations?',
    choices: [
      'Always', 'Often', 'Sometimes', 'Rarely', 'Never'
    ]
  }, {
    type: 'multi',
    en: 'How do you tend to make decisions?',
    choices: [
      'Often based on gut feeling.',
      'Analysing facts. Weight pros and cons.',
      'A mix of gut decisions and logical thinking.',
      'I prefer that others make a decision for me.'
    ]
  }, {
    type: 'multi',
    en: 'You prefer to approach other people ...',
    choices: [
      'Positive and trusting',
      'Reluctantly',
      'Warily or even suspiciously',
      'It depends on the other person and individual situation'
    ]
  }, {
    type: 'multi',
    en: 'Which category of sports do you prefer ?',
    choices: [
      'Team sports',
      'Endurance sports',
      'Strength and weight training',
      'Martial arts',
      'Yoga / Pilates or similar'
    ]
  }];

  questionIndex = 0;
  currentQuestion = this.questions[this.questionIndex];
  finishedQuestions = false;

  ngOnInit() {}

  next() {
    this.questionIndex++;
    if (this.questionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.questionIndex];
    } else {
      this.finishedQuestions = true;
      console.log('questions done!');
    }
  }

  goToScan() {
    this.router.navigateByUrl('scan');
  }

  reset() {
    this.router.navigateByUrl('start');
  }

}