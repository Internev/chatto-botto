import {
  generateSystemPrompt,
  ISystemPromptInput,
  Scenario,
  scenarios,
} from '../prompts'

describe('prompts helpers', () => {
  describe('generateSystemPrompt', () => {
    const mockInput: ISystemPromptInput = {
      level: 'basic',
      language: 'Japanese',
      scenario: 'generic',
    }

    it('should generate a system prompt based on the input', () => {
      const systemPrompt = generateSystemPrompt(mockInput)

      console.log('systemPrompt:', systemPrompt)
      // Add your assertions here to validate the generated system prompt
      expect(systemPrompt).toBeDefined()
      expect(systemPrompt).toContain(scenarios.generic.bot)
      // Add more assertions as needed
    })

    // Add more test cases for different scenarios, levels, and languages
    it('should generate a system prompt for a different scenario', () => {
      const input: ISystemPromptInput = {
        ...mockInput,
        scenario: 'weekend',
      }

      const systemPrompt = generateSystemPrompt(input)

      // Add your assertions here
    })

    it('should generate a system prompt for a different level', () => {
      const input: ISystemPromptInput = {
        ...mockInput,
        level: 'advanced',
      }

      const systemPrompt = generateSystemPrompt(input)

      // Add your assertions here
    })

    it('should generate a system prompt for a different language', () => {
      const input: ISystemPromptInput = {
        ...mockInput,
        language: 'Spanish',
      }

      const systemPrompt = generateSystemPrompt(input)

      // Add your assertions here
    })
  })
})
