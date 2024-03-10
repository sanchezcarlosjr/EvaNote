import {render} from "./render";
import {URIAssociation} from "./URIAssociation";
import React from "react";
import {Done, EditNote, TextSnippet, Try} from "@mui/icons-material";

export default {
  "name": "Default playbook",
  "description": "Default playbook for EvaTutor",
  "version": "1.0.0",
  "keywords": "EvaTutor",
  "license": "MIT",
  "author": "sanchezcarlosjr",
  "settings": {
     "language": "auto",
     "theme": {
       "mode": "auto",
       "fontFamily": "MatterVF, \"Inter\", \"SF Pro Display\", -apple-system, BlinkMacSystemFont, \"Open Sans\", \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif !important"
     },
    "applications": {
      "indexer": {
        "redirect_policy": "always /user-progress"
      }
    },
    "uriAssociation": new URIAssociation([
      {
        "name": "Notebook",
        "pattern": /^((?!\.).)*$/,
        "meta": {
          "icon": <Try />
        },
        "servicePreferenceOrder": ["evanotebook"]
      },
      {
        "name": "Notebook",
        "pattern": /.+\.done\.nb$/,
        "meta": {
          "icon": <Done/>
        },
        "servicePreferenceOrder": ["evanotebook"]
      },
      {
        "name": "Notebook",
        "pattern": /.+\.nb$/,
        "meta": {
          "icon": <EditNote/>
        },
        "servicePreferenceOrder": ["evanotebook"]
      },
      {
        "name": "Plain Text",
        "pattern": /.+\.txt$/,
        "meta": {
          "icon": <TextSnippet />
        },
        "servicePreferenceOrder": ["text-editor"]
      }
    ])
  },
  "dependencies": [
    {
      "uri": "supabase+rpc:dependencies",
      "integrity": "",
      "headers": {},
      "environment": "browser",
      "triggers": ["authentication"]
    },
    {
      "uri": "in-memory:routes",
      "integrity": "",
      "headers": {},
      "environment": "browser",
      "triggers": ["authentication"],
      "data": [
        {
          path: 'user-progress',
          element: render("./applications/user-progress")
        },
        {
          path: 'evanotebook',
          element: render("./applications/evanotebook")
        }
      ]
    }
  ],
  "tasks": []
}