
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Droplets,
  Car,
  Hospital,
  AlertTriangle,
  MapPin,
  Camera,
  Loader2,
  Sparkles,
  CheckCircle,
  Trash2,
  Replace,
  RefreshCw,
  Check,
  Mic,
  StopCircle,
  Upload,
  PartyPopper,
  WifiOff
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { submitReportAction, suggestCategoriesAction, transcribeAudioAction } from "@/app/actions";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useLanguage } from "@/context/language-context";

const issueTypes = [
  {
    id: "cleanliness",
    labelKey: "report_form_issue_cleanliness",
    icon: Trash2,
    color: "bg-emerald-500 text-white",
    iconColor: "text-white",
    subtopicKeys: [
      "report_form_subtopic_cleanliness1",
      "report_form_subtopic_cleanliness2",
      "report_form_subtopic_cleanliness3",
      "report_form_subtopic_cleanliness4",
      "report_form_subtopic_cleanliness5",
      "report_form_subtopic_other",
    ],
  },
  {
    id: "water",
    labelKey: "report_form_issue_water",
    icon: Droplets,
    color: "bg-sky-500 text-white",
    iconColor: "text-white",
    subtopicKeys: [
      "report_form_subtopic_water1",
      "report_form_subtopic_water2",
      "report_form_subtopic_water3",
      "report_form_subtopic_water4",
      "report_form_subtopic_water5",
      "report_form_subtopic_other",
    ],
  },
  {
    id: "roads",
    labelKey: "report_form_issue_roads",
    icon: Car,
    color: "bg-slate-500 text-white",
    iconColor: "text-white",
    subtopicKeys: [
      "report_form_subtopic_roads1",
      "report_form_subtopic_roads2",
      "report_form_subtopic_roads3",
      "report_form_subtopic_other",
    ],
  },
  {
    id: "health",
    labelKey: "report_form_issue_health",
    icon: Hospital,
    color: "bg-rose-500 text-white",
    iconColor: "text-white",
    subtopicKeys: [
      "report_form_subtopic_health1",
      "report_form_subtopic_health2",
      "report_form_subtopic_health3",
      "report_form_subtopic_health4",
      "report_form_subtopic_other",
    ],
  },
  {
    id: "other",
    labelKey: "report_form_issue_other",
    icon: AlertTriangle,
    color: "bg-amber-500 text-white",
    iconColor: "text-white",
    subtopicKeys: [],
  },
];

const formSchema = z
  .object({
    issueType: z.string().min(1, "Please select an issue type."),
    subtopic: z.string().optional(),
    otherIssue: z.string().optional(),
    description: z.string().optional(),
    photo: z.any().refine((file) => file, "Photo is required."),
    locationMethod: z.enum(["current", "digipin"], {
      required_error: "You need to select a location method.",
    }),
    digipin: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.issueType === "other") {
        return !!data.otherIssue && data.otherIssue.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify the issue if you select 'Other'.",
      path: ["otherIssue"],
    }
  )
  .refine(
    (data) => {
      if (data.locationMethod === "digipin") {
        return !!data.digipin && data.digipin.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please enter a DigiPin.",
      path: ["digipin"],
    }
  )
  .refine(
    (data) => {
      if (data.locationMethod === "current") {
        return data.latitude !== undefined && data.longitude !== undefined;
      }
      return true;
    },
    {
      message: "Please capture your location.",
      path: ["latitude"], // Show error under the main location area
    }
  );

type FormValues = z.infer<typeof formSchema>;
type ReportDataType = {
  issueType: string;
  description: string | undefined;
  latitude: number;
  longitude: number;
  photoDataUri: string;
};


export default function ReportForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    categories: string[];
    subcategories: string[];
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [showFailureDialog, setShowFailureDialog] = useState(false);
  const [failedReportData, setFailedReportData] = useState<ReportDataType | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueType: "",
      subtopic: "",
      otherIssue: "",
      description: "",
      locationMethod: "current",
    },
  });
  
  const locationMethod = form.watch("locationMethod");

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 4000); // Animation duration + grace period
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);


  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("photo", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setSuggestions(null); // Reset suggestions when photo changes
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude, {
          shouldValidate: true,
        });
        form.setValue("longitude", position.coords.longitude, {
          shouldValidate: true,
        });
        setIsGettingLocation(false);
        toast({ title: t('report_form_toast_location_captured_title'), description: t('report_form_toast_location_captured_desc') });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          variant: "destructive",
          title: t('report_form_toast_location_error_title'),
          description: `${t('report_form_toast_location_error_desc')} ${error.message}`,
        });
      }
    );
  };

  const handleSuggestCategories = async () => {
    if (!photoPreview) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a photo first.",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestions(null);
    const description = form.getValues("description") || "";
    const result = await suggestCategoriesAction(photoPreview, description);

    if ("error" in result) {
      toast({
        variant: "destructive",
        title: t('report_form_toast_ai_failed_title'),
        description: result.error,
      });
    } else {
      setSuggestions({
        categories: result.suggestedCategories,
        subcategories: result.suggestedSubcategories,
      });
      toast({
        title: t('report_form_toast_ai_ready_title'),
        description: t('report_form_toast_ai_ready_desc'),
      });
    }
    setIsSuggesting(false);
  };

  const applyAISuggestion = (category: string) => {
    const suggestedCategory = issueTypes.find(c => t(c.labelKey) === category);
    if (suggestedCategory) {
       form.setValue("issueType", suggestedCategory.id, { shouldValidate: true });
    } else {
       form.setValue("issueType", "other", { shouldValidate: true });
       form.setValue("otherIssue", category, { shouldValidate: true });
    }
    toast({
      title: t('report_form_toast_ai_applied_title'),
      description: `${t('report_form_toast_ai_applied_desc')} "${category}".`,
    });
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setAudioURL(base64Audio);
          setIsTranscribing(true);
          const result = await transcribeAudioAction(base64Audio);
          if ('transcription' in result) {
            form.setValue('description', result.transcription);
            toast({ title: t('report_form_toast_transcribed_title'), description: t('report_form_toast_transcribed_desc') });
          } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
          }
          setIsTranscribing(false);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: t('report_form_toast_mic_error') });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetrySubmit = async () => {
    if (!failedReportData) return;

    setIsRetrying(true);
    const result = await submitReportAction(failedReportData);
    setIsRetrying(false);

    if (result.success) {
      setShowFailureDialog(false);
      setFailedReportData(null);
      setIsSubmitted(true);
      toast({ title: t('report_form_toast_submit_success_title'), description: result.message });
      form.reset();
      setPhotoPreview(null);
      setSuggestions(null);
      setAudioURL(null);
    } else {
      toast({
        variant: "destructive",
        title: t('report_form_toast_submit_fail_title'),
        description: "The retry attempt also failed. Please try again later.",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!photoPreview) return;
    
    const issueTypeData = issueTypes.find((it) => it.id === values.issueType);
    const finalIssueType =
      values.issueType === "other" && values.otherIssue
        ? values.otherIssue
        : (issueTypeData ? t(issueTypeData.labelKey) : values.issueType);

    const finalDescription = [values.subtopic, values.description]
      .filter(Boolean)
      .join(" - ");

    // Temp: For now, we will simulate lat/lng for digipin.
    // In a real app, you'd use a geocoding service.
    const lat = values.latitude || 23.3441;
    const lng = values.longitude || 85.3096;

    const reportData: ReportDataType = {
      issueType: finalIssueType,
      description: finalDescription,
      latitude: lat,
      longitude: lng,
      photoDataUri: photoPreview,
    };
    
    const isOnline = navigator.onLine;

    if (isOnline) {
      const result = await submitReportAction(reportData);
      if (result.success) {
        setIsSubmitted(true);
        toast({ title: t('report_form_toast_submit_success_title'), description: result.message });
        form.reset();
        setPhotoPreview(null);
        setSuggestions(null);
        setAudioURL(null);
      } else {
        setFailedReportData(reportData);
        setShowFailureDialog(true);
      }
    } else {
        // Save to localStorage
        const pendingReports = JSON.parse(localStorage.getItem('pending_reports') || '[]');
        const newPendingReport = {
          id: `pending-${Date.now()}`,
          ...reportData,
          photoURL: reportData.photoDataUri, // For consistency with mock data
          location: { lat: reportData.latitude, lng: reportData.longitude },
          dateSubmitted: new Date().toISOString(),
          status: 'Pending',
        };
        pendingReports.push(newPendingReport);
        localStorage.setItem('pending_reports', JSON.stringify(pendingReports));
        
        setIsSubmitted(true);
        toast({ 
          title: t('report_form_toast_offline_title'),
          description: t('report_form_toast_offline_desc'),
        });
        
        form.reset();
        setPhotoPreview(null);
        setSuggestions(null);
        setAudioURL(null);
    }
  };

  const selectedIssue = form.watch("issueType");
  const selectedIssueData = issueTypes.find(
    (issue) => issue.id === selectedIssue
  );

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="issueType"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl font-headline">
                      {t('report_form_step1_title')}
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {issueTypes.map((issue) => (
                          <Card
                            key={issue.id}
                            onClick={() => {
                              field.onChange(issue.id);
                              form.setValue("subtopic", "");
                              form.setValue("otherIssue", "");
                            }}
                            className={cn(
                              "p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-lg border-2",
                              field.value === issue.id
                                ? "border-primary shadow-lg"
                                : "border-transparent",
                              issue.color
                            )}
                          >
                            <issue.icon
                              className={cn("h-8 w-8", issue.iconColor)}
                            />
                            <span className="text-center font-medium text-sm">
                              {t(issue.labelKey)}
                            </span>
                          </Card>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedIssue === "other" && (
                <FormField
                  control={form.control}
                  name="otherIssue"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>{t('report_form_other_issue_label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('report_form_other_issue_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedIssueData && selectedIssueData.subtopicKeys.length > 0 && (
                <FormField
                  control={form.control}
                  name="subtopic"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>{t('report_form_subtopic_label')}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== t('report_form_subtopic_other')) {
                            form.setValue("description", value);
                          } else {
                            form.setValue("description", "");
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('report_form_subtopic_placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedIssueData.subtopicKeys.map((subtopicKey) => (
                            <SelectItem key={subtopicKey} value={t(subtopicKey)}>
                              {t(subtopicKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h2 className="text-xl font-headline">
                  {t('report_form_step2_title')}
                </h2>
                <FormField
                  control={form.control}
                  name="photo"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t('report_form_photo_label')}</FormLabel>
                      <div className="w-full h-48 border-2 border-dashed rounded-lg bg-emerald-50 relative group">
                          {photoPreview ? (
                            <>
                              <Image
                                src={photoPreview}
                                alt="Issue preview"
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-lg"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="text-black"
                                  onClick={() => galleryInputRef.current?.click()}
                                >
                                  <Replace />
                                  {t('report_form_photo_replace')}
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <Input
                                  id="camera-input"
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  ref={cameraInputRef}
                                  onChange={handlePhotoChange}
                                />
                                <Input
                                  id="gallery-input"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  ref={galleryInputRef}
                                  onChange={handlePhotoChange}
                                />
                                <Button type="button" onClick={() => cameraInputRef.current?.click()}>
                                  <Camera className="mr-2 h-4 w-4" />
                                  {t('report_form_photo_capture_button')}
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => galleryInputRef.current?.click()}>
                                  <Upload className="mr-2 h-4 w-4" />
                                  {t('report_form_photo_gallery_button')}
                                </Button>
                            </div>
                          )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>{t('report_form_description_label')}</FormLabel>
                        {!isRecording ? (
                          <Button type="button" size="sm" variant="outline" onClick={handleStartRecording} disabled={isTranscribing}>
                            <Mic /> {isTranscribing ? t('report_form_transcribing_button') : t('report_form_record_button')}
                          </Button>
                        ) : (
                          <Button type="button" size="sm" variant="destructive" onClick={handleStopRecording}>
                            <StopCircle /> {t('report_form_stop_button')}
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={t('report_form_description_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      {audioURL && !isTranscribing && (
                        <div className="mt-2">
                          <audio src={audioURL} controls className="w-full" />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 bg-secondary/50 p-4 rounded-lg">
                <h3 className="text-lg font-headline font-semibold">
                  {t('report_form_ai_title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('report_form_ai_description')}
                </p>
                <Button
                  type="button"
                  onClick={handleSuggestCategories}
                  disabled={!photoPreview || isSuggesting}
                  className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  {isSuggesting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                  {t('report_form_ai_button')}
                </Button>
                {suggestions && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => applyAISuggestion(suggestions.categories[0])}
                        disabled={!suggestions.categories.length}
                        className="bg-green-800 text-white hover:bg-green-900"
                      >
                        <Check /> {t('report_form_ai_use_suggestion_button')}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleSuggestCategories}
                        disabled={isSuggesting}
                      >
                        <RefreshCw /> {t('report_form_ai_regenerate_button')}
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm font-medium mt-4 mb-2">{t('report_form_ai_suggested_categories')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => applyAISuggestion(cat)}
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mt-4 mb-2">{t('report_form_ai_suggested_details')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.subcategories.map((subcat) => (
                          <Badge
                            key={subcat}
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() =>
                              form.setValue(
                                "description",
                                `${
                                  form.getValues("description") || ""
                                } ${subcat}`.trim()
                              )
                            }
                          >
                            {subcat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src="https://files.prokerala.com/news/photos/imgs/1024/ranchi-municipal-corporation-1573230.jpg"
                    alt="Municipal Office"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                    data-ai-hint="municipal office building"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-headline">{t('report_form_step3_title')}</h2>
              <FormField
                control={form.control}
                name="locationMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="current" id="current" />
                          </FormControl>
                          <FormLabel htmlFor="current" className="font-normal">
                            {t('report_form_location_current_label')}
                          </FormLabel>
                        </FormItem>
                        <div className="flex items-center space-x-2 opacity-50">
                          <RadioGroupItem value="digipin" id="digipin" disabled />
                          <Label htmlFor="digipin" className="font-normal flex items-center gap-2">
                            {t('report_form_location_digipin_label')}
                            <span className="text-xs text-muted-foreground italic">
                              *currently not available
                            </span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {locationMethod === "current" && (
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <MapPin />
                    )}
                    {t('report_form_location_current_button')}
                  </Button>
                  {form.watch("latitude") && form.watch("longitude") && (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <p className="font-medium">{t('report_form_location_captured_label')}</p>
                      <span className="text-sm text-muted-foreground">
                        ({form.getValues("latitude")?.toFixed(4)},{" "}
                        {form.getValues("longitude")?.toFixed(4)})
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {locationMethod === "digipin" && (
                <FormField
                  control={form.control}
                  name="digipin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('report_form_location_digipin_input_label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('report_form_location_digipin_placeholder')} {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="latitude" // This is just to display the top-level error
                render={() => <FormMessage />}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full text-lg relative overflow-hidden transition-all duration-300",
              {
                  "bg-blue-800 hover:bg-blue-900 text-white": !form.formState.isSubmitting && !isSubmitted,
                  "bg-green-600": form.formState.isSubmitting || isSubmitted,
                  "animate-cracker-burst": isSubmitted,
              }
            )}
            disabled={form.formState.isSubmitting || isSubmitted}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : isSubmitted ? (
              <PartyPopper className="h-6 w-6" />
            ) : (
              t('report_form_submit_button')
            )}
          </Button>
        </form>
      </Form>
      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submission Failed</AlertDialogTitle>
            <AlertDialogDescription>
              We couldn't submit your report at this time. Please try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRetrySubmit} disabled={isRetrying}>
              {isRetrying ? <Loader2 className="animate-spin" /> : "Try Again"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    