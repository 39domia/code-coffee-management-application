package com.controller.api;

import com.model.Account;
import com.service.AccountService;
import com.validate.PasswordValidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "api/accounts")
public class AccountRestController {
    @Autowired
    private AccountService accountService;

    @Autowired
    private PasswordValidate passwordValidate;

    //  api list account
    @GetMapping
    public ResponseEntity<?> list() {
        List<Account> accounts = accountService.findAll();
        if (!accounts.isEmpty()) {
            return new ResponseEntity<>(accounts, HttpStatus.OK);
        }
        return new ResponseEntity<List<Account>>(HttpStatus.NO_CONTENT);
    }

//    api find by id

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> get(@PathVariable("id") Long id) {
        Account account = accountService.findByID(id);
        if (account != null) {
            return new ResponseEntity<>(account, HttpStatus.OK);
        }
        return new ResponseEntity<Account>(HttpStatus.NOT_FOUND);
    }

    //    api  create account
    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody Account account, BindingResult result) {
        passwordValidate.validate(account, result);
        if (result.hasErrors()) {
            List<FieldError> fieldErrors = result.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fieldError : fieldErrors) {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        accountService.save(account);
        return new ResponseEntity<>(account, HttpStatus.CREATED);
    }


    //   edit account
    @PutMapping(value = "/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @Valid @RequestBody Account account, BindingResult result) {
        //     tìm ra id account
        Account currentAccount = accountService.findByID(id);
//      nếu có thì ktra lỗi k thì update
        if (currentAccount != null) {
            passwordValidate.validate(account, result);
            if (result.hasErrors()) {
                List<FieldError> fieldErrors = result.getFieldErrors();
                Map<String, String> errors = new HashMap<>();
                for (FieldError fieldError : fieldErrors) {
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage());
                }
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            currentAccount.setUsername(account.getUsername());
            currentAccount.setPassword(account.getPassword());
            currentAccount.setAuthorization(account.getAuthorization());
            accountService.update(currentAccount);
            return new ResponseEntity<>(currentAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable("id") long id) {
        Account account = accountService.findByID(id);
        if (account != null) {
            accountService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
