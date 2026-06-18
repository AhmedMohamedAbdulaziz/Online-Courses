<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LessonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi,wmv,mkv|max:204800', // 100MB limit
            'duration' => 'required|integer|min:1',
        ];

        if ($this->isMethod('post')) {
            $rules['video_url'] = 'required_without:video_file|nullable|string';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['sort_order'] = 'required|integer';
        } else {
            $rules['sort_order'] = 'nullable|integer';
        }

        return $rules;
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422));
    }
}
