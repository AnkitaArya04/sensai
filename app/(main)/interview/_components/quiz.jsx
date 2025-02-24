"use client";

import { useState,useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { generateQuiz, saveQuizResult } from "@/actions/interview";
  import { Button } from "@/components/ui/button";
  import { BarLoader } from "react-spinners";
const Quiz=()=>{
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

    const {
        loading: generatingQuiz,
        fn: generateQuizFn,
        data: quizData,
      } = useFetch(generateQuiz);

    const {
        loading: generatingQuiz,
        fn: generateQuizFn,
        data: quizData,
      } = useFetch(generateQuiz);
      

      useEffect(() => {
        if (quizData) {
          setAnswers(new Array(quizData.length).fill(null));
        }
      }, [quizData]);  

      if (generatingQuiz) {
        return <BarLoader className="mt-4" width={"100%"} color="gray" />;
      }  
  
    return (
        <Card className="mx-2">
          <CardHeader>
            <CardTitle>Ready to test your knowledge?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This quiz contains 10 questions specific to your industry and
              skills. Take your time and choose the best answer for each question.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={generateQuizFn} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      );
    }
    const question = quizData[currentQuestion];
    return (
        <Card className="mx-2">
          <CardHeader>
            <CardTitle>
              Question {currentQuestion + 1} of {quizData.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">{question.question}</p>
            <RadioGroup
              onValueChange={handleAnswer}
              value={answers[currentQuestion]}
              className="space-y-2"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
    
            {showExplanation && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">Explanation:</p>
                <p className="text-muted-foreground">{question.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!showExplanation && (
              <Button
                onClick={() => setShowExplanation(true)}
                variant="outline"
                disabled={!answers[currentQuestion]}
              >
                Show Explanation
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion] || savingResult}
              className="ml-auto"
            >
              {savingResult && (
                <BarLoader className="mt-4" width={"100%"} color="gray" />
              )}
              {currentQuestion < quizData.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          </CardFooter>
        </Card>
      );
    
export default Quiz;