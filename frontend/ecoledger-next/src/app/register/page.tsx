"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../../components/Logo';

// Define FormData interface
interface UserFormData {
  name?: string;
  email?: string;
  password?: string;
  idNumber?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  landProofFile?: File | null;
}

// Step 1: Personal Information Form
const Step1 = ({ formData, setFormData, nextStep }: { 
  formData: UserFormData; 
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  nextStep: () => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="max-w-md w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number</label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            required
            value={formData.idNumber || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// Step 2: Document Upload
const Step2 = ({ formData, setFormData, nextStep, prevStep }: {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Please upload a PDF file');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError('File size should be less than 5MB');
        setFile(null);
        return;
      }
      
      setFileError('');
      setFile(selectedFile);
      setFormData(prev => ({ ...prev, landProofFile: selectedFile }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setFileError('Please upload a proof of land document');
      return;
    }
    nextStep();
  };

  return (
    <div className="max-w-md w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Upload Proof of Land</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please upload a PDF document that proves your land ownership. This will be reviewed by our team to verify your eligibility for carbon tokens.
          </p>
        </div>

        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {file ? (
              <div className="text-sm text-gray-600 bg-green-50 p-4 rounded-md">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 font-medium">{file.name}</p>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  type="button" 
                  className="mt-2 text-sm text-red-600 hover:text-red-500"
                  onClick={() => {
                    setFile(null);
                    setFormData(prev => ({ ...prev, landProofFile: null }));
                  }}
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 5MB</p>
              </>
            )}
            {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// Step 3: Confirmation
const Step3 = ({ formData, router }: {
  formData: UserFormData;
  router: ReturnType<typeof useRouter>;
}) => {
  return (
    <div className="max-w-md w-full text-center">
      <div className="rounded-md bg-green-50 p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-16 w-16 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">Registration Submitted</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Thank you for registering with EcoLedger! Your proof of land is now under review.</p>
              <p className="mt-2">Once approved, you will receive an email with further instructions. You can then log in and link your wallet to start receiving carbon tokens.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

// Progress Steps Indicator
const ProgressSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, name: 'Personal Information' },
    { id: 2, name: 'Document Upload' },
    { id: 3, name: 'Confirmation' },
  ];

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {step.id < currentStep ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-green-600" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-600 hover:bg-green-800">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">{step.name}</span>
                  </div>
                </>
              ) : step.id === currentStep ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" aria-hidden="true" />
                    <span className="sr-only">{step.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                    <span className="sr-only">{step.name}</span>
                  </div>
                </>
              )}
              
              <div className="hidden sm:block absolute top-10 -inset-x-4 text-center">
                <div className="text-sm font-medium text-gray-500">
                  {step.name}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({});
  const router = useRouter();

  const nextStep = () => {
    if (currentStep === 2) {
      // Mock API call to submit registration
      console.log('Registration data:', formData);
      // Simulate API call delay
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <Logo withText size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <ProgressSteps currentStep={currentStep} />
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex justify-center">
          {currentStep === 1 && <Step1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
          {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 3 && <Step3 formData={formData} router={router} />}
        </div>
      </div>
    </div>
  );
} 