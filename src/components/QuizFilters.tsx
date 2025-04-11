
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';

interface QuizFiltersProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const QuizFilters = ({ difficulty, setDifficulty, category, setCategory }: QuizFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="space-y-2">
        <Label className="block mb-2 font-medium">Difficulty Level</Label>
        <ToggleGroup 
          type="single" 
          value={difficulty} 
          onValueChange={(value) => value && setDifficulty(value)}
          className="justify-start flex-wrap"
        >
          <ToggleGroupItem value="all" className="text-sm">All</ToggleGroupItem>
          <ToggleGroupItem value="easy" className="text-sm">Easy</ToggleGroupItem>
          <ToggleGroupItem value="intermediate" className="text-sm">Intermediate</ToggleGroupItem>
          <ToggleGroupItem value="hard" className="text-sm">Hard</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="space-y-2">
        <Label className="block mb-2 font-medium">Category</Label>
        <ToggleGroup 
          type="single" 
          value={category} 
          onValueChange={(value) => value && setCategory(value)}
          className="justify-start flex-wrap"
        >
          <ToggleGroupItem value="all" className="text-sm">All</ToggleGroupItem>
          <ToggleGroupItem value="syntax" className="text-sm">Syntax</ToggleGroupItem>
          <ToggleGroupItem value="output" className="text-sm">Output</ToggleGroupItem>
          <ToggleGroupItem value="debugging" className="text-sm">Debugging</ToggleGroupItem>
          <ToggleGroupItem value="functions" className="text-sm">Functions</ToggleGroupItem>
          <ToggleGroupItem value="concepts" className="text-sm">Concepts</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default QuizFilters;
