
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import { translateTextAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type Translations = { [key: string]: string };

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translations: Translations;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  isTranslating: boolean;
}

const defaultTexts: Translations = {
    // Home Page
    'home_title_1': 'Your City,',
    'home_title_2': 'Your Responsibility',
    'home_subtitle': 'Quickly and easily report municipal issues like potholes, broken streetlights, and more. Help us make our city better, together.',
    'home_report_button': 'Report an Issue Now',
    'home_notifications_title': 'Notifications & Updates',
    'home_notifications_subtitle': 'Stay informed with the latest announcements from your municipality.',
    'home_how_it_works_title': 'How It Works',
    'home_step1_title': '1. Report an Issue',
    'home_step1_description': 'Select a category, snap a photo, add a description, and let our AI help you categorize it.',
    'home_step2_title': '2. Track Progress',
    'home_step2_description': "Follow your report's status from \"Submitted\" to \"Resolved\" with real-time updates.",
    'home_step3_title': '3. See it Resolved',
    'home_step3_description': 'Get notified when the issue is resolved and contribute to a better community.',
    'home_partnership_title': 'A Partnership for Progress',
    'home_partnership_description': 'MeraShahar connects citizens directly with municipal services, fostering collaboration and transparency. Every report you make is a step towards a safer, cleaner, and more efficient city.',
    'home_our_work_button': 'Our Work',

    // Header
    'header_issues_covered': 'Issues Covered',
    'header_my_reports': 'My Reports',
    'header_my_account': 'My Account',
    'header_logout': 'Log out',
    'header_login': 'Login',
    'header_signup': 'Sign Up',

    // Footer
    'footer_about_title': 'About MeraShahar',
    'footer_about_description': 'Connecting citizens with their municipal corporation to build a better, cleaner, and more efficient city. Report issues, track their resolution, and be a part of the change.',
    'footer_copyright': 'Your City, Your Responsibility.',
    'footer_contact_title': 'Contact Municipal Corporation',
    'footer_contact_address': 'Municipal Corporation Building, Main Street, Cityville, 12345',
    'footer_contact_hours_title': 'Operating Hours:',
    'footer_contact_hours_weekdays': 'Monday - Friday: 9:00 AM - 5:00 PM',
    'footer_contact_hours_weekends': 'Saturday - Sunday: Closed',
    'footer_follow_title': 'Follow Us',
    'footer_follow_description': 'Stay updated with the latest news and announcements from the corporation.',

    // Issues Covered Page
    'issues_covered_title': 'Issues Covered',
    'issues_covered_subtitle': 'MeraShahar empowers you to report a wide range of municipal issues. Below is a comprehensive list of categories you can report on.',
    'issues_covered_cleanliness_title': 'Cleanliness & Waste Management',
    'issues_covered_cleanliness_item1': 'Garbage collection and disposal',
    'issues_covered_cleanliness_item2': 'Street cleaning',
    'issues_covered_cleanliness_item3': 'Segregation & recycling of waste',
    'issues_covered_cleanliness_item4': 'Removal of dead animals',
    'issues_covered_cleanliness_item5': 'Fogging & pest control (mosquitoes, flies, etc.)',
    'issues_covered_water_title': 'Water & Drainage',
    'issues_covered_water_item1': 'Clean drinking water supply',
    'issues_covered_water_item2': 'Repair of water leakages',
    'issues_covered_water_item3': 'Sewage system maintenance',
    'issues_covered_water_item4': 'Drainage cleaning & overflow prevention',
    'issues_covered_water_item5': 'Rainwater harvesting / flood control',
    'issues_covered_roads_title': 'Roads & Transport',
    'issues_covered_roads_item1': 'Repair of potholes and damaged roads',
    'issues_covered_roads_item2': 'Construction of new roads and footpaths',
    'issues_covered_roads_item3': 'Streetlight installation and maintenance',
    'issues_covered_roads_item4': 'Parking space management',
    'issues_covered_roads_item5': 'Removal of road encroachments',
    'issues_covered_environment_title': 'Environment & Public Spaces',
    'issues_covered_environment_item1': 'Tree plantation and maintenance',
    'issues_covered_environment_item2': 'Development & upkeep of parks and gardens',
    'issues_covered_environment_item3': 'Air & water pollution control',
    'issues_covered_environment_item4': 'Public playgrounds and open spaces',
    'issues_covered_health_title': 'Health & Safety',
    'issues_covered_health_item1': 'Municipal hospitals & clinics',
    'issues_covered_health_item2': 'Vaccination drives and health camps',
    'issues_covered_health_item3': 'Control of infectious diseases',
    'issues_covered_health_item4': 'Fire brigade services & disaster management',
    'issues_covered_admin_title': 'Administrative & Regulatory Functions',
    'issues_covered_admin_item1': 'Issuing trade/shop licenses',
    'issues_covered_admin_item2': 'Property tax collection',
    'issues_covered_admin_item3': 'Approvals for building construction',
    'issues_covered_admin_item4': 'Regulation of markets and vendors',
    'issues_covered_urban_title': 'Urban Development & Housing',
    'issues_covered_urban_item1': 'Slum improvement and rehabilitation',
    'issues_covered_urban_item2': 'Affordable housing projects',
    'issues_covered_urban_item3': 'Maintenance of public toilets and sanitation',
    'issues_covered_grievances_title': 'Public Grievances & Citizen Services',
    'issues_covered_grievances_item1': 'Complaint redressal for drainage, cleanliness, lighting, etc.',
    'issues_covered_grievances_item2': 'Online/offline grievance systems',
    'issues_covered_grievances_item3': 'Awareness campaigns on civic duties',

    // My Reports Page
    'my_reports_title': 'My Reports',
    'my_reports_submitted_on': 'Submitted on',
    'my_reports_status_submitted': 'Submitted',
    'my_reports_status_in_progress': 'In Progress',
    'my_reports_status_resolved': 'Resolved',
    'my_reports_status_pending': 'Pending Sync',
    'my_reports_report_id': 'Report ID',
    'my_reports_submitted': 'Submitted',
    'my_reports_photo': 'Photo',
    'my_reports_description': 'Description',
    'my_reports_location': 'Location',
    'my_reports_status_timeline': 'Status Timeline',
    'my_reports_status': 'Status',
    'my_reports_no_reports_title': 'No reports yet!',
    'my_reports_no_reports_description': "When you submit an issue, you'll see it here.",
    'my_reports_report_first_button': 'Report Your First Issue',

    // Report Page
    'report_title': 'Report a New Issue',
    'report_subtitle': "Your report makes a difference. Let's get the details.",
    'report_mayor_name': 'MAYOR',
    'report_message_title': 'A Message from Your Municipal Corporation',
    'report_message_content': 'We are committed to resolving your issues promptly. Your detailed reports help us allocate resources effectively and build a better city for everyone. Thank you for your active participation.',

    // Report Form
    'report_form_step1_title': "1. What's the issue?",
    'report_form_issue_cleanliness': 'Cleanliness & Sanitation',
    'report_form_issue_water': 'Water Supply & Drainage',
    'report_form_issue_roads': 'Roads & Street Lighting',
    'report_form_issue_health': 'Public Health & Hygiene',
    'report_form_issue_other': 'Other Issues',
    'report_form_other_issue_label': 'Please specify the issue',
    'report_form_other_issue_placeholder': 'e.g., Fallen Tree',
    'report_form_subtopic_label': 'Select a sub-topic',
    'report_form_subtopic_placeholder': 'Select a specific issue',
    'report_form_subtopic_cleanliness1': 'Sweeping and cleaning of streets',
    'report_form_subtopic_cleanliness2': 'Door-to-door garbage collection',
    'report_form_subtopic_cleanliness3': 'Disposal of solid waste',
    'report_form_subtopic_cleanliness4': 'Cleaning of drains and sewers',
    'report_form_subtopic_cleanliness5': 'Removal of dead animals',
    'report_form_subtopic_water1': 'Providing drinking water to households',
    'report_form_subtopic_water2': 'Maintenance of water pipelines',
    'report_form_subtopic_water3': 'Repairing leakages',
    'report_form_subtopic_water4': 'Cleaning of public wells/hand pumps',
    'report_form_subtopic_water5': 'Maintaining drainage/sewerage system',
    'report_form_subtopic_roads1': 'Construction and repair of local roads and lanes',
    'report_form_subtopic_roads2': 'Maintenance of footpaths',
    'report_form_subtopic_roads3': 'Installation and repair of streetlights',
    'report_form_subtopic_health1': 'Running primary health centres/dispensaries',
    'report_form_subtopic_health2': 'Vaccination & health awareness drives',
    'report_form_subtopic_health3': 'Pest control (mosquito fogging, etc.)',
    'report_form_subtopic_health4': 'Sanitation campaigns',
    'report_form_subtopic_other': 'Other',
    'report_form_step2_title': '2. Add Photo & Description',
    'report_form_photo_label': 'Upload/Capture Photo',
    'report_form_photo_placeholder': 'Click to upload or take a picture',
    'report_form_photo_capture_button': 'Capture Photo',
    'report_form_photo_gallery_button': 'Upload from Gallery',
    'report_form_photo_replace': 'Replace Photo',
    'report_form_description_label': 'Add Description',
    'report_form_record_button': 'Record Voice',
    'report_form_transcribing_button': 'Transcribing...',
    'report_form_stop_button': 'Stop',
    'report_form_description_placeholder': 'Provide any additional details or use voice recording...',
    'report_form_ai_title': 'AI-Powered Assistance',
    'report_form_ai_description': 'After uploading a photo, use our AI to suggest categories for a quicker report.',
    'report_form_ai_button': 'Get AI Suggestions',
    'report_form_ai_use_suggestion_button': 'Use Suggestion',
    'report_form_ai_regenerate_button': 'Regenerate',
    'report_form_ai_suggested_categories': 'Suggested Categories',
    'report_form_ai_suggested_details': 'Suggested Details',
    'report_form_step3_title': '3. Pinpoint the Location',
    'report_form_location_current_label': 'Use Current Location',
    'report_form_location_digipin_label': 'Enter DigiPin',
    'report_form_location_current_button': 'Get Current Location',
    'report_form_location_captured_label': 'Location Captured!',
    'report_form_location_digipin_input_label': 'DigiPin (Pincode)',
    'report_form_location_digipin_placeholder': 'Enter your 6-digit pincode',
    'report_form_submit_button': 'Submit Report',
    'report_form_toast_location_captured_title': 'Success',
    'report_form_toast_location_captured_desc': 'Location captured.',
    'report_form_toast_location_error_title': 'Error',
    'report_form_toast_location_error_desc': 'Could not get location:',
    'report_form_toast_ai_failed_title': 'AI Suggestion Failed',
    'report_form_toast_ai_ready_title': 'AI Suggestions Ready',
    'report_form_toast_ai_ready_desc': 'Click a suggestion to apply it.',
    'report_form_toast_ai_applied_title': 'AI Suggestion Applied',
    'report_form_toast_ai_applied_desc': 'Category set to',
    'report_form_toast_transcribed_title': 'Success',
    'report_form_toast_transcribed_desc': 'Voice note transcribed.',
    'report_form_toast_mic_error': 'Could not start recording. Please grant microphone permissions.',
    'report_form_toast_submit_success_title': 'Success!',
    'report_form_toast_submit_fail_title': 'Submission Failed',
    'report_form_toast_offline_title': 'You are offline',
    'report_form_toast_offline_desc': 'Your report is saved and will be submitted when you are back online.',
    
    // Login Page
    'login_title': 'Welcome Back!',
    'login_description': 'Log in to your MeraShahar account',
    'login_username_label': 'Username',
    'login_username_placeholder': 'Your username',
    'login_password_label': 'Password',
    'login_password_placeholder': 'Your password',
    'login_button': 'Log In',
    'login_signup_prompt': "Don't have an account?",
    'login_signup_link': 'Sign up',
    'login_toast_success_title': 'Login Successful',
    'login_toast_success_desc': 'Welcome back,',
    'login_toast_fail_title': 'Login Failed',

    // Signup Page
    'signup_title': 'Create an Account',
    'signup_description': 'Join MeraShahar to start reporting issues.',
    'signup_username_label': 'Username',
    'signup_username_placeholder': 'Choose a username',
    'signup_password_label': 'Password',
    'signup_password_placeholder': 'Choose a password',
    'signup_button': 'Sign Up',
    'signup_login_prompt': 'Already have an account?',
    'signup_login_link': 'Log in',
    'signup_toast_success_title': 'Account Created',
    'signup_toast_success_desc': 'You have successfully signed up. Please log in.',
    'signup_toast_fail_title': 'Signup Failed',

    // Our Work Page
    'our_work_title': 'Our Work & Impact',
    'our_work_subtitle': 'Visualizing our commitment to a better city.',
    'our_work_resolved_title': 'Resolved Cases by Category',
    'our_work_resolved_desc': 'Breakdown of all successfully resolved issues.',
    'our_work_in_progress_title': 'In-Progress Cases by Category',
    'our_work_in_progress_desc': 'Breakdown of issues currently being addressed.',
    'our_work_submitted_title': 'Submitted Cases by Category',
    'our_work_submitted_desc': 'Breakdown of newly reported issues awaiting action.',
    'our_work_status_resolved': 'Resolved',
    'our_work_status_in_progress': 'In Progress',
    'our_work_status_submitted': 'Submitted',
    
    // Homepage Notices
    'notice_posted_on': 'Posted on {{date}}',
    'notice_maintenance_title': 'Scheduled Road Maintenance',
    'notice_maintenance_date': 'August 10, 2024',
    'notice_maintenance_content': 'Main Street will have lane closures from August 12th to 15th for repaving work. Please plan alternate routes.',
    'notice_water_title': 'Water Supply Disruption Alert',
    'notice_water_date': 'August 9, 2024',
    'notice_water_content': 'Sectors 5-8 will experience a temporary water supply shutdown on August 11th from 10 AM to 2 PM for essential repairs.',
    'notice_health_title': 'Health Advisory: Dengue Prevention',
    'notice_health_date': 'August 8, 2024',
    'notice_health_content': 'With the monsoon season, residents are advised to prevent water stagnation to control mosquito breeding. Fogging will be conducted in all zones.',
    'notice_community_title': 'Community Park Cleanup Drive',
    'notice_community_date': 'August 7, 2024',
    'notice_community_content': 'Join us on August 18th at 8 AM for a community-led cleanup drive at Central Park. Your participation is valuable!',

    // Officials Page
    'officials_title': 'List of Officials',
    'officials_subtitle': 'Meet the key leaders serving our city.',
    'official_mayor_name': 'Mamta Khoja',
    'official_mayor_title': 'Mayor',
    'official_commissioner_name': 'Mukesh Kumar',
    'official_commissioner_title': 'Municipal Commissioner',
    'official_deputy_mayor_name': 'Sanjiv Vijayawargia',
    'official_deputy_mayor_title': 'Deputy Mayor',
    'official_engineer_name': 'P.K. Singh',
    'official_engineer_title': 'Chief Engineer',
    'official_health_officer_name': 'Dr. Kiran Kumari',
    'official_health_officer_title': 'Medical Health Officer',
    'official_secretary_name': 'Rajesh Gupta',
    'official_secretary_title': 'Executive Secretary',

    // Schemes Page
    'schemes_title': 'Government Schemes',
    'schemes_subtitle': 'Explore beneficial schemes available to citizens.',
    'scheme_pmjay_title': 'Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    'scheme_pmjay_desc': 'A national public health insurance fund of India that aims to provide free access to health insurance coverage for low income earners in the country.',
    'scheme_pmjay_link': 'Learn More & Apply',
    'scheme_swa_title': 'Swachh Bharat Abhiyan',
    'scheme_swa_desc': 'A country-wide campaign initiated by the Government of India in 2014 to eliminate open defecation and improve solid waste management.',
    'scheme_swa_link': 'Participate Now',
    'scheme_amrut_title': 'Atal Mission for Rejuvenation and Urban Transformation (AMRUT)',
    'scheme_amrut_desc': 'The purpose of this scheme is to ensure that every household has access to a tap with an assured supply of water and a sewerage connection.',
    'scheme_amrut_link': 'Discover the Benefits',
    'scheme_pmay_title': 'Pradhan Mantri Awas Yojana (PMAY)',
    'scheme_pmay_desc': 'An initiative by the Government of India in which affordable housing will be provided to the urban poor with a target of building 20 million affordable houses by 31 March 2022.',
    'scheme_pmay_link': 'Check Eligibility'
};


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState<Translations>(defaultTexts);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleSetLanguage = useCallback(async (lang: string) => {
    setLanguage(lang);
    if (lang === "en") {
      setTranslations(defaultTexts);
      return;
    }

    setIsTranslating(true);
    try {
      const textsToTranslate = Object.values(defaultTexts);
      const result = await translateTextAction(textsToTranslate.join(' || '), lang);
      
      if ('translatedText' in result) {
        const translatedTexts = result.translatedText.split(' || ');
        const newTranslations: Translations = {};
        Object.keys(defaultTexts).forEach((key, index) => {
          newTranslations[key] = translatedTexts[index] || defaultTexts[key];
        });
        setTranslations(newTranslations);
      } else {
        toast({
          variant: "destructive",
          title: "Translation Failed",
          description: result.error,
        });
        setTranslations(defaultTexts);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Translation Error",
        description: "An unexpected error occurred during translation.",
      });
      setTranslations(defaultTexts);
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    let text = translations[key] || defaultTexts[key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        text = text.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }
    return text;
  }, [translations]);


  const contextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    translations,
    t,
    isTranslating
  }), [language, handleSetLanguage, translations, t, isTranslating]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
