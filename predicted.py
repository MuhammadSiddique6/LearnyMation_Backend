import joblib

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

model = joblib.load('field_recommendation_model.joblib')

def suggest_improvement(scores):
    suggestions = {}
    for i, score in enumerate(scores):
        subject = subjects[i]
        if score <= 2:
            suggestions[subject] = improvement_tips_low[subject]
        elif score == 3:
            suggestions[subject] = improvement_tips_medium[subject]
    return suggestions

def predict_fields_and_suggest(scores):
    # Predict one field based on model
    predicted_field = model.predict([scores])[0]

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

    return recommendation, improvements

if __name__ == "__main__":
    user_scores = [5,3,4,2,1]  # Example: Math=4, Science=4 (top scores), others lower

    recommended_fields, improvement_suggestions = predict_fields_and_suggest(user_scores)
    field =recommended_fields
    print(f"Predicted Field(s): {recommended_fields}")
    if (field=="Math"):
        print(f"Recommended Field(s): I would to suggest go to engineering or IT field, because you have a high score in {recommended_fields}.")
    elif(field=="Science"):
        print(f"Recommended Field(s): I would to suggest go to medical or research field, because you have a high score in {recommended_fields}.")
    elif(field=="Logic Thinking"):
        print(f"Recommended Field(s): I would to suggest go to law or philosophy field, because you have a high score in {recommended_fields}.")
    elif(field=="Creativity"):
        print(f"Recommended Field(s): I would to suggest go to arts or design field, because you have a high score in {recommended_fields}.")
    elif(field=="Object Detection"):
        print(f"Recommended Field(s): I would to suggest go to engineering or architecture field, because you have a high score in {recommended_fields}.")
    if improvement_suggestions:
        print("Subjects to improve and suggestions:")
        for subj, tip in improvement_suggestions.items():
            print(f"- {subj}: {tip}")
    else:
        print("Great scores! Keep up the good work.")
