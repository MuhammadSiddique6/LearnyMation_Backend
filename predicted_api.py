import joblib
import sys
import json

subjects = ["Math", "Science", "Logic Thinking", "Creativity", "Object Detection"]

improvement_tips_low = {
    "Math": "Focus on foundational math topics like addition, subtraction, and multiplication. Use practical exercises.",
    "Science": "Start with basic science concepts using experiments and visual aids to improve understanding.",
    "Logic Thinking": "Practice simple puzzles and reasoning games to develop logical thinking skills.",
    "Creativity": "Engage in drawing, storytelling, and imaginative play to boost creativity.",
    "Object Detection": "Play memory and object identification games to improve observation skills."
}

improvement_tips_medium = {
    "Math": "Practice problem-solving and try intermediate exercises to improve your math skills.",
    "Science": "Read more about scientific concepts and try small projects or demonstrations.",
    "Logic Thinking": "Solve medium-level puzzles and brain teasers to sharpen your logic.",
    "Creativity": "Try more complex creative activities like painting or creative writing.",
    "Object Detection": "Play advanced memory games and try spotting differences in pictures."
}

def suggest_improvement(scores):
    suggestions = {}
    for i, score in enumerate(scores):
        subject = subjects[i]
        if score <= 2:
            suggestions[subject] = improvement_tips_low[subject]
        elif score == 3:
            suggestions[subject] = improvement_tips_medium[subject]
    return suggestions

def get_field_recommendation(field):
    recommendations = {
        "Math": "I would suggest going to engineering or IT field, because you have a high score in Math.",
        "Science": "I would suggest going to medical or research field, because you have a high score in Science.",
        "Logic Thinking": "I would suggest going to law or philosophy field, because you have a high score in Logic Thinking.",
        "Creativity": "I would suggest going to arts or design field, because you have a high score in Creativity.",
        "Object Detection": "I would suggest going to engineering or architecture field, because you have a high score in Object Detection."
    }
    return recommendations.get(field, "")

def predict_fields_and_suggest(scores):
    try:
        model = joblib.load('field_recommendation_model.joblib')
        # Predict one field based on model
        predicted_field = model.predict([scores])[0]
    except Exception as e:
        # If model fails, use the highest score as the predicted field
        max_score = max(scores)
        max_index = scores.index(max_score)
        predicted_field = subjects[max_index]

    max_score = max(scores)
    # Get all fields with the max score
    top_fields = [subjects[i] for i, score in enumerate(scores) if score == max_score]

    # If the top score is low (<= 2), recommend 'Needs Improvement'
    if max_score <= 2:
        recommendation = "Needs Improvement"
    else:
        recommendation = ", ".join(top_fields)

    # Get improvement suggestions for weak or medium subjects
    improvements = suggest_improvement(scores)
    
    # Get specific field recommendation
    field_recommendation = ""
    if len(top_fields) == 1:
        field_recommendation = get_field_recommendation(top_fields[0])
    elif len(top_fields) > 1:
        field_recommendation = "You have multiple strengths. Consider exploring fields that combine these areas."

    return {
        "predicted_field": predicted_field,
        "top_fields": top_fields,
        "recommendation": recommendation,
        "field_recommendation": field_recommendation,
        "improvements": improvements,
        "scores": {subjects[i]: score for i, score in enumerate(scores)}
    }

if __name__ == "__main__":
    # Get scores from command line arguments
    try:
        user_scores = [int(arg) for arg in sys.argv[1:6]]
        if len(user_scores) != 5:
            # Use default scores if not enough arguments
            user_scores = [3, 3, 3, 3, 3]
    except:
        # Default scores if there's an error
        user_scores = [3, 3, 3, 3, 3]

    result = predict_fields_and_suggest(user_scores)
    
    # Print as JSON for Node.js to parse
    print(json.dumps(result))
